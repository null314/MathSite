/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;*/
using System;
using System.Drawing;


namespace Net
{
	public class Fishka
	{
		internal Moveable<Vec> mPos;
		internal Player mPlayer;
		internal bool mAlive;
		private double mDeadProc;
		const int mSize = 30;
		private Connect<Fishka, Node> mNodeConnect;

		public Fishka(Player player, int x, int y)
		{
			mDeadProc = 0;
			mAlive = true;
			mNodeConnect = new Connect<Fishka, Node>(this);
			mPlayer = player;
			mPos = new Moveable<Vec>(new Vec(x, y));
		}

		public void inc(double elapse)
		{
			mPos.inc(elapse);
			if (!mAlive)
				mDeadProc += elapse;
		}

		internal void kill()
		{
			mAlive = false;
			mDeadProc = 0;
			mNodeConnect.disconnect();
		}

		public void paint(Drawer drawer, bool selected)
		{
			if (mAlive)
				if (selected)
					drawer.drawEllipse(new Pen(mPlayer.mColor, 3), mPos.getValue(), mSize);
				else
					drawer.drawEllipse(new Pen(mPlayer.mColor, 2), mPos.getValue(), mSize);
			else
			{
				if (mDeadProc < 1)
				{
					drawer.drawExplose(new Pen(mPlayer.mColor, 2), mPos.getValue(), mSize / 2, mDeadProc);
				}			
			}
		}

		public bool isSelected(Vec pos)
		{
			return mPos.getValue().isInside(pos, mSize);
		}

		internal void connectToNode(Node node, float speed)
		{
			mNodeConnect.connectTo(node.getConnect());
			mPos.moveTo(() => node.mPos, speed, Moveable<Vec>.trivFunc);
		}

		public bool hasNode()
		{
			return mNodeConnect.connected();
		}

		public static Predicate<Fishka> pHasNode = delegate(Fishka f)
		{
			return f.hasNode();
		};


		public Node getNode()
		{
			return mNodeConnect.getOtherSide();
		}

	}
}
