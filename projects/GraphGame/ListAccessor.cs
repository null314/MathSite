using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	public class ListAccessor<A> : IEnumerable<A>
	{
		private List<A> mList;
		private Predicate<A> mFilter;

		public ListAccessor(List<A> list, Predicate<A> filter)
		{
			mFilter = filter;
			mList = list;
		}
		public ListAccessor(List<A> list)
		{
			mFilter = (a) => true;
			mList = list;
		}

		IEnumerator<A> IEnumerable<A>.GetEnumerator()
		{
			foreach (A a in mList)
				if (mFilter(a))
					yield return a;
		}
		public System.Collections.IEnumerator GetEnumerator()
		{
			foreach(A a in mList)
				if(mFilter(a))
					yield return a;
		}

		public bool any(Predicate<A> pred)
		{
			foreach (A a in this)
				if (pred(a))
					return true;
			return false;
		}
		public bool all(Predicate<A> pred)
		{
			foreach (A a in this)
				if (!pred(a))
					return false;
			return true;
		}
		public int count()
		{ 
			int count = 0;
			foreach (A a in this)
				count++;
			return count;
		}

		public A getRandom()
		{
			int i = new Random().Next(count());
			foreach (A a in this)
			{
				if (i == 0)
					return a;
				i--;
			}
			return default(A);
		}
		public A getRandom(Predicate<A> pred)
		{ 
			A a;
			do
			{
				a = getRandom();
			} while (!pred(a));
			return a;
		}

		public bool ifAny(Predicate<A> pred, Func<A, bool> fun)
		{
			if (any(pred))
			{
				A a = getRandom(pred);
				return fun(a);
			}
			else
				return false;
		}





		public Cont<R, A> toCont<R>(R nothing) where R: Del.IMaybe
		{
			return new Cont<R, A>(delegate(Func<A, R> fun)
			{
				List<R> list = new List<R>();
				foreach (A a in this)
				{
					R r = fun(a);
					if (!r.isNothing())
						list.Add(r);
				}
				if (list.Count == 0)
					return nothing;
				else
					return list[new Random().Next(list.Count)];
			});
		}

		public Cont<R, B> toContBind<R, B>(R nothing, Func<A, Cont<R, B>> amb) where R: Del.IMaybe
		{
			return toCont<R>(nothing).bind(amb);
		}

	}
}
