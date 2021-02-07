using System;
using System.Windows.Forms;
using System.Drawing;

namespace Net
{
	class ControllerComp : Controller
	{
		Mouse mMouse;
		Node mSelectedNode;
		Fishka mSelectedFishka;
		Player mPlayer;
		Line mSelectedLine;
		Del.None mWin;
		double mThinkTime;

		public ControllerComp(Del.None win)
		{
			mThinkTime = 0;
			mWin = win;
			mMouse = new Mouse(null, onDragLeft, null, null);
		}

		public void win()
		{
			mWin();
		}

		public void init(Player player)
		{
			mPlayer = player;
		}

		public void paint(Drawer drawer)
		{
			mPlayer.paintForController(drawer, mMouse.mPos, out mSelectedNode, out mSelectedFishka, out mSelectedLine);
/*			foreach (Node node in mPlayer.mNodeAccessor)
			{ 
				if(!underAttack()(node))
					drawer.drawEllipse(new Pen(Color.Green), node.mPos, 50);
			}*/
		}

		public void mouseMove(MouseEventArgs e)
		{
			mMouse.move(e);
		}
		public void mouseDown(MouseEventArgs e)
		{
			mMouse.down(e);
		}
		public void mouseUp(MouseEventArgs e)
		{
			mMouse.up(e);
		}

		DragRezult onDragLeft(Vec pos)
		{
			if (mSelectedNode != null)
				return mSelectedNode.getDragger(pos);
			return null;
		}

		public void inc(double inc)
		{
			mPlayer.incForController(inc);
			mThinkTime += inc;

			if (mThinkTime > 3)
				makeMove();
		}
		public void onBeginTurn()
		{
			mThinkTime = 0;
		}
		public void onEndTurn()
		{
			mMouse.detach();
		}


		static Predicate<A> not<A>(Predicate<A> pred)
		{
			return (a) => !pred(a);
		}
		static Predicate<A> and<A>(Predicate<A> pred1, Predicate<A> pred2)
		{
			return (a) => pred1(a) && pred2(a);
		}
		static Predicate<A> and<A>(Predicate<A> pred1, Predicate<A> pred2, Predicate<A> pred3)
		{
			return (a) => pred1(a) && pred2(a) && pred3(a);
		}
		static Predicate<A> pTrue<A>()
		{
			return (a) => true;
		}


		Predicate<Node> underAttack()
		{
			return (node) => mPlayer.mLineAccessor.any((line) => 
				line.pToNode(node) && line.pFromNode(Node.pHasFishka(mPlayer.pEnemy())));
		}
		Predicate<Node> canAttack()
		{
			return (node) => mPlayer.mLineAccessor.any((line) => 
				line.pFromNode(node) && line.pToNode(Node.pHasFishka(mPlayer.pEnemy())));
		}



		static bool apply(Cont<Static.Move, Static.Move> cont)
		{
			Static.Move m = cont.mFunc((i) => i);
			if (m.isNothing())
				return false;
			else
				return m.apply();
		}

		static Cont<Static.Move, Static.Move> noMove()
		{
			return Cont<Static.Move, Static.Move>.ret(new Static.MoveNothing());
		}

		Cont<Static.Move, Static.Move> clickLineMove(Line line, String log)
		{
			return Cont<Static.Move, Static.Move>.ret(new Static.MoveClickLine(mPlayer, line, log));
		}

		Cont<Static.Move, Static.Move> clickNodeMove(Node node, String log)
		{
			return Cont<Static.Move, Static.Move>.ret(new Static.MoveClickNode(mPlayer, node, log));
		}

		Cont<Static.Move, Static.Move> dragFishkaToNodeMove(Fishka fishka, Node node, String log)
		{
			return Cont<Static.Move, Static.Move>.ret(new Static.MoveDragFishkaToNode(mPlayer, fishka, node, log));
		}



		public void makeMove()
		{
			ListAccessor<Fishka> myFishka = mPlayer.mMyFishkaAccessor;
			ListAccessor<Fishka> enemyFishka = mPlayer.mEnemyFishkaAccessor;
			ListAccessor<Node> nodes = mPlayer.mNodeAccessor;
			ListAccessor<Line> lines = mPlayer.mLineAccessor;


			// встречная атака
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node) && underAttack()(node))
					return lines.with((line) =>
					{
						if (line.pFromNode(node) && 
							line.pToNode(Node.pHasFishka(mPlayer.pEnemy())))
							return clickLineMove(line, "front attack");
						else
							return noMove();
					});
				else
					return noMove();
			})))
				return;

			// уход из под атаки
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node) && underAttack()(node))
					return lines.with((line) =>
					{
						if (line.pFromNode(node) && line.pToNode(and(
							Node.pEmpty(),
							not(underAttack()))))
							return clickLineMove(line, "run from attack");
						else
							return noMove();
					});
				else
					return noMove();
			})))
				return;

			// атака
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node))
					return lines.with((line) =>
					{
						if (line.pFromNode(node) && line.pToNode(Node.pHasFishka(mPlayer.pEnemy())))
							return clickLineMove(line, "attack!!");
						else
							return noMove();
					});
				else
					return noMove();
			})))
				return;


			// поставить в атакующую клетку
			if (apply(myFishka.with((fishka) =>
			{
				if (!fishka.hasNode())
					return nodes.with((node) =>
					{
						if (!underAttack()(node) && canAttack()(node))
							return dragFishkaToNodeMove(fishka, node, "put for attack");
						else
							return noMove();

					});
				else
					return noMove();
			})))
				return;

			// походить в атакующую клетку
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node))
					return lines.with((line) =>
					{
						if (line.pFromNode(node) && line.pToNode(and(
							Node.pEmpty(),
							not(underAttack()),
							canAttack())))
							return clickLineMove(line, "move for attack");
						else
							return noMove();
					});
				else
					return noMove();
			})))
				return;

			// поставить в клетку не под атакой
			if (apply(myFishka.with((fishka) =>
			{
				if (!fishka.hasNode())
					return nodes.with((node) =>
					{
						if (!underAttack()(node))
							return dragFishkaToNodeMove(fishka, node, "put safe place");
						else
							return noMove();

					});
				else
					return noMove();
			})))
				return;


			// походить в клетку не под атакой
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node))
					return lines.with((line) =>
					{
						if (line.pFromNode(node) && line.pToNode(and(
							Node.pEmpty(),
							not(underAttack()))))
							return clickLineMove(line, "move to safe place");
						else
							return noMove();
					});
				else
					return noMove();
			})))
				return;

			// использовать цикл не под атакой
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node) && !underAttack()(node))
					return lines.with((line) =>
					{
						if (line.pFromNode(node) && line.isCycle())						
							return clickLineMove(line, "safe cycle");
						else
							return noMove();
					});
				else
					return noMove();
			})))
				return;

		
			// поставить в любую (под атакой)
			if (apply(myFishka.with((fishka) =>
			{
				if (!fishka.hasNode())
					return nodes.with((node) =>
					{
						return dragFishkaToNodeMove(fishka, node, "put somewhere");
					});
				else
					return noMove();
			})))
				return;

			// походить в любую клетку (под атакой)
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node))
					return lines.with((line) =>
					{
						if (line.pFromNode(node) && line.pToNode(Node.pEmpty()))
							return clickLineMove(line, "move somewhere");
						else
							return noMove();
					});
				else
					return noMove();
			})))
				return;

			// убить фишку
			if (apply(nodes.with((node) =>
			{
				if (Node.pHasFishka(mPlayer.pMine())(node))
					return clickNodeMove(node, "kill myself");
				else
					return noMove();
			})))
				return;


		}

	}
}
