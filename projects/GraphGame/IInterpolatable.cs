using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	public interface IInterpolatable<A>
	{
		A interpolate(A obj, double alpha);
	}
}
