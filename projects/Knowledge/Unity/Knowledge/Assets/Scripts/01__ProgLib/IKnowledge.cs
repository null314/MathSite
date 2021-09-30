using System;
using State = System.Collections.Generic.List<int>;


namespace ProgLib
{

	public interface IKnowledge
	{
		Func<State, bool> Get(State state);

	}
}