using State = System.Collections.Generic.List<int>;

namespace ProgLib
{

	public class GetProp : IProp<int>
	{
		private readonly int Index;

		public GetProp(int index)
		{
			this.Index = index;
		}

		public int Get(State state)
		{
			return state[Index];
		}
	}
}