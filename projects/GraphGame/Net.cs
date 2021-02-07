using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Drawing;

namespace Net
{
    public class Net
    {
        internal List<Node> mNode;
		internal List<Line> mLine;
		Player mPlayer1;
		Player mPlayer2;
		Player mCurPlayer;
		Counter<OrderedPair<Node>> mPairCounter;
		internal Func<String, bool> mLogger;
		internal bool mGameOver;

        public Net(Func<String, bool> logger, Controller c1, Controller c2, int nodeCount, int lineCount, int firstFishkaCount, int secondFishkaCount, int width, int height)
        {
			mGameOver = false;
			mLogger = logger;
			mNode = new List<Node>();
			mLine = new List<Line>();
			mPairCounter = new Counter<OrderedPair<Node>>();

			mPlayer1 = new Player(Color.Blue, c1, this);
			mPlayer2 = new Player(Color.Red, c2, this);
			mPlayer1.setEnemy(mPlayer2);
			mPlayer2.setEnemy(mPlayer1);
			c1.init(mPlayer1);
			c2.init(mPlayer2);

			mCurPlayer = mPlayer1;
            Random r = new Random();

			for (int i = 0; i < firstFishkaCount; i++)
				mPlayer1.add(new Fishka(mPlayer1, 50 + 50 * i, height - 80));
			for (int i = 0; i < secondFishkaCount; i++)
				mPlayer2.add(new Fishka(mPlayer2, width - 50 - 50 * i, 50));
				
			for (int i = 0; i < nodeCount; i++)
                mNode.Add(new Node(75 + r.Next(width - 150), 75 + r.Next(height - 150)));

			for (int i = 0; i < nodeCount; i++)
			{
				for (int o = 0; o < lineCount; o++)
				{
					int nodeIndex = r.Next(nodeCount);
					SwapPair<Node> swapPair = genSwapPair(i, nodeIndex);
					OrderedPair<Node> orderedPair = swapPair.getOrderedPair();
					int shift = mPairCounter.get(orderedPair);
					mPairCounter.increase(orderedPair);
					mLine.Add(new Line(swapPair, shift));
				}
			}
        }
		public Controller getCurPlayerController()
		{
			return mCurPlayer.mController;
		}

		private SwapPair<Node> genSwapPair(int i, int o)
		{
			return new SwapPair<Node>(mNode[i], mNode[o], i < o);
		}

		internal void endTurn()
		{
			if (!mGameOver)
			{
				if (mPlayer1.mFishka.All((Fishka fishka) => !fishka.mAlive))
				{
					mGameOver = true;
					mPlayer2.mController.win();
				}
				if (mPlayer2.mFishka.All((Fishka fishka) => !fishka.mAlive))
				{
					mGameOver = true;
					mPlayer1.mController.win();
				}
			}

			if(!mGameOver)
			{
				mCurPlayer.mController.onEndTurn();
				if (mCurPlayer == mPlayer1)
					mCurPlayer = mPlayer2;
				else
					if (mCurPlayer == mPlayer2)
						mCurPlayer = mPlayer1;
				mCurPlayer.mController.onBeginTurn();
			}
		}

		internal void paint(Drawer drawer, Vec pos, 
			out Node selectedNode, out Fishka selectedFishka, out Line selectedLine)
        {
			drawer.fillScreen(new SolidBrush(Color.White), new Pen(mCurPlayer.mColor, 6));

			selectedNode = findNode(pos);
			foreach (Line line in mLine)
				line.calcPos(mPairCounter);
			selectedLine = findLine(pos);

			Fishka fishka = mPlayer1.findFishka(pos);
			if(fishka == null)
				fishka = mPlayer2.findFishka(pos);

			selectedFishka = fishka;

			mPlayer1.paint(drawer, fishka);
			mPlayer2.paint(drawer, fishka);
			
			foreach (Node node in mNode)
				node.paint(drawer, node == selectedNode);
			foreach (Line line in mLine)
				line.paint(drawer, line == selectedLine);

        }
		internal Node findNode(Vec pos)
		{
			foreach (Node node in mNode)
				if (node.isSelected(pos))
					return node;
			return null;
		}

		internal Line findLine(Vec pos)
		{
			foreach (Line line in mLine)
				if (line.isSelected(pos))
					return line;
			return null;
		}

		internal void inc(double elapse)
		{
			mPlayer1.inc(elapse);
			mPlayer2.inc(elapse);
			foreach (Line line in mLine)
				line.inc(elapse);
		}
	
		internal Line getCycle(Node node)
		{
			foreach (Line line in mLine)
				if (line.mPair.mFirst == node && line.mPair.mSecond == node && line.mAlive)
					return line;
			return null;
		}
	}
}
