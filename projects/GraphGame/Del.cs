using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	public class Del
	{
		public delegate Rezult Getter<Rezult>();
		public delegate Rezult Function<Value, Rezult>(Value value);
		public delegate void None();


		public interface IMaybe
		{
			bool isNothing();
		}

	}
}
