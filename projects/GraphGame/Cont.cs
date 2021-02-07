using System;

namespace Net
{
	public class Cont<R, A>
	{
		public Func<Func<A, R>, R> mFunc;

		public Cont(Func<Func<A, R>, R> func)
		{
			mFunc = func;
		}

		public Cont<R, B> bind<B>(Func<A, Cont<R, B>> amb)
		{
			return new Cont<R, B>((mb) => mFunc((a) => amb(a).mFunc(mb)));
		}

		public static Cont<R, A> ret(A a)
		{
			return new Cont<R, A>((ar) => ar(a));
		}
	}
}
