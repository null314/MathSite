using State = System.Collections.Generic.List<int>;

namespace ProgLib
{
	public interface IProp<A>
	{
		A Get(State state);
	}
}