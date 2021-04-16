using System.Collections.Generic;

public struct IntComparer : IComparer<int>
{
	public int Compare(int x, int y)
	{
		return x == y ? 0 : 1;
	}
}
