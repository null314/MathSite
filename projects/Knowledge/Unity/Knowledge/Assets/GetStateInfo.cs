using State = System.Collections.Generic.List<int>;

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
