using System.Windows.Forms;


namespace Net
{
    public struct Mouse
    {
		public Vec mPos;
		private MouseButton mLeft;
		private MouseButton mRight;

		public Mouse(MouseButton.EventClick onClickLeft, MouseButton.EventDrag onDragLeft,
			MouseButton.EventClick onClickRight, MouseButton.EventDrag onDragRight)
		{
			mLeft = new MouseButton(onClickLeft, onDragLeft);
			mRight = new MouseButton(onClickRight, onDragRight);
			mPos = new Vec(0, 0);
		}

		public void detach()
		{
			mLeft.detach();
			mRight.detach();
		}

		public void move(MouseEventArgs e)
		{
			mPos = new Vec(e.X, e.Y);
			mLeft.move(mPos);
			mRight.move(mPos);
		}

		public void down(MouseEventArgs e)
		{
			mPos = new Vec(e.X, e.Y);
			switch (e.Button)
			{
			case MouseButtons.Left:
				mLeft.down(mPos);
				break;
			case MouseButtons.Right:
				mRight.down(mPos);
				break;
			}
		}
		public void up(MouseEventArgs e)
		{
			mPos = new Vec(e.X, e.Y);
			switch (e.Button)
			{
				case MouseButtons.Left:
					mLeft.up(mPos);
					break;
				case MouseButtons.Right:
					mRight.up(mPos);
					break;
			}
		}

    }
}
