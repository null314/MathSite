using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	public struct Moveable<A> : IValue<A> where A : IInterpolatable<A>
	{
		public delegate A Ender();
		public delegate double Func(double x);
		static public double trivFunc(double x)
		{
			return x;
		}

		public static Ender constEnder(A value)
		{
			return () => value;
		}


		A mBegin;
		Ender mEnd;
		A mCur;
		double mPos;
		double mTime;
		bool mMove;
		Func mFunc;

		public Moveable(A value)
		{
			mBegin = value;
			mEnd = constEnder(value);
			mCur = value;
			mPos = 1;
			mMove = false;
			mTime = 0;
			mFunc = null;
		}

		public void inc(double elapse)
		{
			if (mMove)
			{
				mPos += elapse / mTime;
				if (mPos > 1)
				{
					mPos = 1;
					mMove = false;
				}
				mCur = mBegin.interpolate(mEnd(), mPos);
			}
			else
				mCur = mEnd();
		}
		public void moveTo(Ender end, double time, Func func)
		{
			mPos = 0;
			mBegin = mCur;
			mEnd = end;
			mTime = time;
			mFunc = func;
			mMove = true;
		}

		public A getValue()
		{
			return mCur;
		}


	}
}

