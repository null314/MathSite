using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;

namespace Net
{
	public class Line
	{
		internal	SwapPair<Node>	mPair;
		private		SwapPair<Vec>	mVecPair;
		private		int				mShift;
		private		const int		W = 10;
		internal	bool			mAlive;
		private		double			mDeadProc;

		internal Line(SwapPair<Node> pair, int shift)
		{
			mDeadProc = 0;
			mAlive = true;
			mPair = pair;
			mShift = shift;
		}

		public void inc(double elapse)
		{
			if (!mAlive)
				mDeadProc += elapse;
		}

		internal void calcPos(Counter<OrderedPair<Node>> pairCounter)
		{
			if (!isCycle())
			{
				mVecPair = mPair.map<Vec>(delegate(OrderedPair<Node> pair)
				{
					Vec delta = pair.mSecond.mPos - pair.mFirst.mPos;
					Vec vec = delta.norm();

					double shift = (mShift - (pairCounter.get(mPair.getOrderedPair()) - 1) * 0.5f) * W;
					Vec pFirst = pair.mFirst.mPos + vec.rotate() * shift + vec * Node.mSize / 2;
					Vec pSecond = pair.mSecond.mPos + vec.rotate() * shift - vec * Node.mSize / 2;
					return new OrderedPair<Vec>(pFirst, pSecond);
				});
			}
			else
			{
				Vec pos = mPair.mFirst.mPos + Vec.getDir(mShift, 3, W);
				mVecPair = new SwapPair<Vec>(pos, pos, false);
			}
		}

		private Vec getCenter()
		{
			return (mVecPair.mFirst + mVecPair.mSecond) * 0.5f;
		}

		internal void paint(Drawer drawer, bool selected)
		{
			Color color = Color.Black;
			if (mPair.mFirst.hasFishka())
				color = mPair.mFirst.getFishka().mPlayer.mColor;

			if (mAlive)
			{
				Pen pen = new Pen(color);
				if (selected)
					pen = new Pen(color, 3);

				if (!isCycle())
				{
					Vec delta2 = mVecPair.mSecond - mVecPair.mFirst;
					Vec vec2 = delta2.norm();
					Vec p1 = mVecPair.mSecond - vec2 * W + vec2.rotate() * W / 2;
					Vec p2 = mVecPair.mSecond - vec2 * W - vec2.rotate() * W / 2;

					drawer.drawLine(pen, mVecPair.mFirst, mVecPair.mSecond);
					drawer.drawLine(pen, p1, mVecPair.mSecond);
					drawer.drawLine(pen, p2, mVecPair.mSecond);
					drawer.drawEllipse(pen, getCenter(), W / 3);
				}
				else
				{
					drawer.drawEllipse(pen, mVecPair.mFirst, W);
				}
			}
			else
			{
				if (mDeadProc < 1)
				{
					if (isCycle())
					{
						drawer.drawExplose(new Pen(color, 1), mVecPair.mFirst, W / 2, mDeadProc);
					}
					else
					{
						const int PART = 10;
						const double PART_1 = 1.0 / PART;

						for (int i = 0; i < PART; i++)
						{
							Vec delta2 = mVecPair.mSecond - mVecPair.mFirst;
							Vec vec2 = delta2.norm();
							Vec p1 = mVecPair.mFirst + vec2 * W;
							Vec p2 = mVecPair.mSecond - vec2 * W;

							double a = i * PART_1 + mDeadProc * PART_1 / 2;
							double b = (i + 1) * PART_1 - mDeadProc * PART_1 / 2;

							drawer.drawLine(new Pen(color, 1), p1.interpolate(p2, a), p1.interpolate(p2, b));
						}
					}
				}
			}
		}

		internal bool isSelected(Vec pos)
		{
			return getCenter().isInside(pos, W);
		}

/*		static public Predicate<Line> pFromNode(Predicate<Node> pred)
		{
			return (line) => pred(line.mPair.mFirst);
		}
		static public Predicate<Line> pToNode(Predicate<Node> pred)
		{
			return (line) => pred(line.mPair.mSecond);
		}

	
		static public Predicate<Line> pFromNode(Node n)
		{
			return (line) => line.mPair.mFirst == n;
		}
		static public Predicate<Line> pToNode(Node n)
		{
			return (line) => line.mPair.mSecond == n;
		}
		static public Predicate<Line> pToEmpty()
		{
			return (line) => !line.mPair.mSecond.hasFishka();
		}
		static public Predicate<Line> pCycle()
		{
			return (line) => line.isCycle();
		}*/

		public bool pFromNode(Node n)
		{
			return mPair.mFirst == n;
		}
		public bool pToNode(Node n)
		{
			return mPair.mSecond == n;
		}

	
		public bool pFromNode(Predicate<Node> pred)
		{
			return pred(mPair.mFirst);
		}
		public bool pToNode(Predicate<Node> pred)
		{
			return pred(mPair.mSecond);
		}
		public bool isCycle()
		{
			return mPair.mFirst == mPair.mSecond;
		}


	}
}
