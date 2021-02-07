
namespace Net
{
	public class Counter<A> : DictionaryDefault<A, int>
	{
		public Counter() : base(0)
		{ 
		}
		public void increase(A obj)
		{
			apply(obj, (x) => x + 1);
		}
	}
}
