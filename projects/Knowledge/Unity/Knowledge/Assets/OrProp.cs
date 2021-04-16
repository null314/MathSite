using System.Linq;
using State = System.Collections.Generic.List<int>;

public class OrProp : IProp<bool>
{
	private readonly IProp<bool>[] StateInfoArray;

	public OrProp(IProp<bool>[] stateInfoArray)
	{
		this.StateInfoArray = stateInfoArray;
	}

	public bool Get(State state)
	{
		return StateInfoArray.Any(s => s.Get(state));
	}
}
