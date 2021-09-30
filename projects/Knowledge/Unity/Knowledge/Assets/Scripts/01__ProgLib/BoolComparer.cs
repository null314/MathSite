using System.Collections.Generic;

namespace ProgLib
{

	public struct BoolComparer : IComparer<bool>
	{
		public int Compare(bool x, bool y)
		{
			return x == y ? 0 : 1;
		}
	}
}