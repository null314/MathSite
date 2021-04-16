using System;
using System.Collections.Generic;
using State = System.Collections.Generic.List<int>;

public class AboutKnowledge<A>: IKnowledge
{
	private readonly IProp<A> StateInfo;
	private readonly IComparer<A> Comparer;

	public AboutKnowledge(IProp<A> stateInfo, IComparer<A> comparer)
	{
		StateInfo = stateInfo;
		Comparer = comparer;
	}

	public Func<State, bool> Get(State state)
	{
		var info = StateInfo.Get(state);

		return (s) =>
		{
			return Comparer.Compare(StateInfo.Get(s), info) == 0;
		};
	}
}
