using State = System.Collections.Generic.List<int>;



public interface IProp<A>
{
	A Get(State state);
}
