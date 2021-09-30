using State = System.Collections.Generic.List<int>;

namespace ProgLib
{

	public class EqualProp : IProp<bool>
	{
		private readonly IProp<int> StateInfo1;
		private readonly IProp<int> StateInfo2;

		public EqualProp(IProp<int> stateInfo1, IProp<int> stateInfo2)
		{
			this.StateInfo1 = stateInfo1;
			this.StateInfo2 = stateInfo2;
		}

		public bool Get(State state)
		{
			return StateInfo1.Get(state) == StateInfo2.Get(state);
		}
	}
}