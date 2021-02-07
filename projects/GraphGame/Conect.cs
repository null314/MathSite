using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	public class Connect <A, B>
	{
		private A mParent;
		private Connect<B, A> mOtherSide;

		public Connect(A parent)
		{
			mParent = parent;
		}

		public B getOtherSide()
		{
			return mOtherSide.mParent;
		}

		public void disconnect()
		{
			if (mOtherSide != null)
			{
				mOtherSide.mOtherSide = null;
				mOtherSide = null;
			}
		}

		public bool connected()
		{
			return mOtherSide != null;
		}

		public void connectTo(Connect<B, A> connect)
		{
			disconnect();
			connect.disconnect();

			connect.mOtherSide = this;
			mOtherSide = connect;
		}

	}
}
