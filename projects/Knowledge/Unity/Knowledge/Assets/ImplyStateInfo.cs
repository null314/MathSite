using System.Collections.Generic;
using System.Linq;
using State = System.Collections.Generic.List<int>;

public class ImplyStateInfo: IProp<bool>
{
	private readonly IKnowledge A;
	private readonly IKnowledge B;
	private readonly List<State> FullState;

	public ImplyStateInfo(IKnowledge a, IKnowledge b, List<State> fullState)
	{
		this.A = a;
		this.B = b;
		this.FullState = fullState;
	}

	public bool Get(State state)
	{
		return FullState.All(s => Imply(A.Get(s)(state), B.Get(s)(state)));
	}

	private static bool Imply(bool a, bool b)
	{
		return (a && !b) == false;
	}
}
