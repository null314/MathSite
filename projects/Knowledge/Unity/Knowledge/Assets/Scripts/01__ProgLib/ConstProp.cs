using State = System.Collections.Generic.List<int>;

namespace ProgLib
{

	public class ConstProp : IProp<int>
	{
		private readonly int Value;

		public ConstProp(int value)
		{
			this.Value = value;
		}

		public int Get(State state)
		{
			return Value;
		}
	}
}