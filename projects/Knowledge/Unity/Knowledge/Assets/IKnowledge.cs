using System;
using State = System.Collections.Generic.List<int>;

public interface IKnowledge
{
	Func<State, bool> Get(State state);

}
