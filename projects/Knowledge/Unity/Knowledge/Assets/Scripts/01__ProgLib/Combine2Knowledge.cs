using System;
using State = System.Collections.Generic.List<int>;

namespace ProgLib
{

	public class Combine2Knowledge : IKnowledge
	{
		public readonly IKnowledge Knowledge1;
		public readonly IKnowledge Knowledge2;

		public Combine2Knowledge(IKnowledge knowledge1, IKnowledge knowledge2)
		{
			this.Knowledge1 = knowledge1;
			this.Knowledge2 = knowledge2;
		}

		public Func<State, bool> Get(State stateTrue)
		{
			return (s) =>
			{
				return Knowledge1.Get(stateTrue)(s) && Knowledge2.Get(stateTrue)(s);
			};
		}
	}
}