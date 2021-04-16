using System;
using State = System.Collections.Generic.List<int>;

public class IsTrueKnowledge: IKnowledge
{
	private readonly IProp<bool> StateInfo;

	public IsTrueKnowledge(IProp<bool> stateInfo)
	{
		StateInfo = stateInfo;
	}

	public Func<State, bool> Get(State state)
	{
		return (s) =>
		{
			return StateInfo.Get(state);
		};
	}
}
