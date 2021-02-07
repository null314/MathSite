using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	struct OrderedPair<A>
	{
		public A mFirst;
		public A mSecond;
		public OrderedPair(A f, A s)
		{
			mFirst = f;
			mSecond = s;
		}
	}
}
