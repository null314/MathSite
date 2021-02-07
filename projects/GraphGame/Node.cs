using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;

namespace Net
{
    public class Node
    {
		public Vec mPos;
		internal const int mSize = 40;
		private Connect<Node, Fishka> mFishkaConnect;

        internal Node(int x, int y)
        {
			mFishkaConnect = new Connect<Node, Fishka>(this);
            mPos = new Vec(x, y);
        }

        internal void paint(Drawer drawer, bool selected)
        {
			Color color = Color.Black;
			if (mFishkaConnect.connected() && mFishkaConnect.getOtherSide().mAlive)
				color = mFishkaConnect.getOtherSide().mPlayer.mColor;

			if(selected)
				drawer.drawEllipse(new Pen(color, 3), mPos, mSize);
			else
				drawer.drawEllipse(new Pen(color), mPos, mSize);
		}


		internal bool isSelected(Vec pos)
		{
			return mPos.isInside(pos, mSize);
		}

		public DragRezult getDragger(Vec mpos)
		{
			Vec delta = mPos - mpos;

			return new DragRezult( 
				delegate(Vec pos)
				{
					mPos = pos + delta;
				},
				delegate(Vec pos)
				{
					mPos = pos + delta;
				});
		}


		public bool hasFishka()
		{
			return mFishkaConnect.connected() && mFishkaConnect.getOtherSide().mAlive;
		}

		public static Predicate<Node> pHasFishka(Predicate<Fishka> pred)
		{
			return (node) => node.hasFishka() && pred(node.getFishka());
		}
		public static Predicate<Node> pEmpty()
		{
			return (node) => !node.hasFishka();
		}

		public Fishka getFishka()
		{
			return mFishkaConnect.getOtherSide();
		}

		internal Connect<Node, Fishka> getConnect()
		{
			return mFishkaConnect;
		}

	}
}
