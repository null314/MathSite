using System;
using System.Collections.Generic;
using System.Drawing;

namespace Net
{
	public class Player
	{
		internal Controller mController;
		internal List<Fishka> mFishka;
		internal Color mColor;
		private Net mNet;
		private Player mEnemy;
		public ListAccessor<Fishka> mMyFishkaAccessor;
		public ListAccessor<Fishka> mEnemyFishkaAccessor;
		public ListAccessor<Node> mNodeAccessor;
		public ListAccessor<Line> mLineAccessor;

		internal Player(Color color, Controller controller, Net net)
		{
			mNet = net;
			mController = controller;
			mColor = color;
			mFishka = new List<Fishka>();
			mMyFishkaAccessor = new ListAccessor<Fishka>(mFishka, (fishka)=> fishka.mAlive);
			mNodeAccessor = new ListAccessor<Node>(mNet.mNode);
			mLineAccessor = new ListAccessor<Line>(mNet.mLine, (line)=> line.mAlive);
		}

		internal void setEnemy(Player enemy)
		{
			mEnemy = enemy;
			mEnemyFishkaAccessor = new ListAccessor<Fishka>(mEnemy.mFishka, (fishka) => fishka.mAlive);
		}

		internal void add(Fishka fishka)
		{
			mFishka.Add(fishka);
		}

		public void paintForController(Drawer drawer, Vec pos, out Node selectedNode, out Fishka selectedFishka, out Line selectedLine)
		{
			mNet.paint(drawer, pos, out selectedNode, out selectedFishka, out selectedLine);
		}


		internal void paint(Drawer drawer, Fishka selectedFishka)
		{
			foreach (Fishka fishka in mFishka)
				fishka.paint(drawer, selectedFishka == fishka);
		}

		private bool fishkaIsMine(Fishka f)
		{
			return f.mPlayer == this && f.mAlive;
		}

		internal Fishka findFishka(Vec pos)
		{
			foreach(Fishka fishka in mFishka)
				if(fishka.isSelected(pos))
					return fishka;
			return null;
		}

		internal void inc(double elapse)
		{
			foreach (Fishka fishka in mFishka)
				fishka.inc(elapse);
		}

		public DragRezult getFishkaDragger(Fishka fishka, Vec mpos)
		{
			if (fishkaIsMine(fishka))
			{
				Vec startPos = fishka.mPos.getValue();
				Vec delta = startPos - mpos;

				return new DragRezult(
					delegate(Vec pos)
					{
						fishka.mPos = new Moveable<Vec>(pos + delta);
					},
					delegate(Vec end)
					{
						Node node = mNet.findNode(end + delta);
						if (node == null || !dragFishkaToNode(fishka, node))
							fishka.mPos.moveTo(Moveable<Vec>.constEnder(startPos), 1, Moveable<Vec>.trivFunc);
					});
			}
			return null;
		}



		public bool dragFishkaToNode(Fishka fishka, Node node)
		{
			if (mNet.mGameOver)
				return false;

			if (fishkaIsMine(fishka) &&
				!fishka.hasNode() && !node.hasFishka())
			{
				fishka.connectToNode(node, 1);
				mNet.endTurn();
				return true;
			}
			else
				return false;
		}
		public bool clickNode(Node node)
		{
			if (mNet.mGameOver)
				return false;

			if (node.hasFishka() && fishkaIsMine(node.getFishka()))
			{
				Line line = mNet.getCycle(node);
				if (line != null)
				{
					line.mAlive = false;
				}
				else
				{
					node.getFishka().kill();
				}
				mNet.endTurn();
				return true;
			}
			return false;
		}

		public bool clickLine(Line line)
		{
			if (mNet.mGameOver)
				return false;

			if (line.mPair.mFirst.hasFishka())
			{
				Fishka fishka = line.mPair.mFirst.getFishka();
				if (fishka.mPlayer == this)
				{
					if (line.mPair.mSecond.hasFishka())
					{
						if (line.mPair.mSecond.getFishka() == fishka)
						{
						}
						else
						{
							line.mPair.mSecond.getFishka().kill();
						}
					}
					else
					{
						fishka.connectToNode(line.mPair.mSecond, 3);
					}

					line.mAlive = false;
					mNet.endTurn();
					return true;
				}
			}
			return false;
		}

		public void incForController(double inc)
		{
			mNet.inc(inc);
		}

		public Predicate<Fishka> pMine()
		{
			return (fishka) => fishkaIsMine(fishka);
		}
		public Predicate<Fishka> pEnemy()
		{
			return (fishka) => fishka.mPlayer == mEnemy;
		}

		public Predicate<Line> pLineToEnemy()
		{
			return (line) => line.mPair.mSecond.hasFishka() &&
				line.mPair.mSecond.getFishka().mPlayer == mEnemy;
		}
		public Predicate<Line> pLineFromEnemy()
		{
			return (line) => line.mPair.mFirst.hasFishka() &&
				line.mPair.mSecond.getFishka().mPlayer == mEnemy;
		}


		public void log(String s)
		{
			mNet.mLogger(s);
		}
	}
}
