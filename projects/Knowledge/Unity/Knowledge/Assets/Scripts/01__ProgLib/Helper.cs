using System.Collections.Generic;
using System.Linq;


namespace ProgLib
{

	public static class Helper
	{
		public static IEnumerable<int> Traverse(this int i)
		{
			return Enumerable.Range(0, i);
		}
	}
}