using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	struct SwapPair<A>
	{
		public A mFirst;
		public A mSecond;
		bool mSwaped;

		public OrderedPair<A> getOrderedPair()
		{
			if(mSwaped)
				return new OrderedPair<A>(mSecond, mFirst);
			else
				return new OrderedPair<A>(mFirst, mSecond);
		}
		public SwapPair(A first, A second, bool swaped)
		{
			mSwaped = swaped;
			mFirst = first;
			mSecond = second;
		}
		public SwapPair(OrderedPair<A> pair, bool swaped)
		{
			mSwaped = swaped;
			if (swaped)
			{
				mFirst = pair.mSecond;
				mSecond = pair.mFirst;
			}
			else
			{
				mFirst = pair.mFirst;
				mSecond = pair.mSecond;
			}
		}

		public delegate OrderedPair<Value> Func<Value>(OrderedPair<A> pair);
		public SwapPair<Value> map<Value>(Func<Value> func)
		{
			OrderedPair<Value> pair = func(getOrderedPair());
			return new SwapPair<Value>(pair, mSwaped);
		}

	}
}
