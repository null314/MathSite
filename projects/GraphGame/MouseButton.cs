namespace Net
{
    public struct MouseButton
    {
		private enum State { None, Down, Drag, NoDrag };

        private State mState;
		EventClick mOnClick;
		EventDrag mOnDrag;
		DragRezult mDragRezult;

		public delegate void EventClick(Vec pos);
		public delegate DragRezult EventDrag(Vec pos);

        internal MouseButton(EventClick onClick, EventDrag onDrag)
        {
			mState = State.None;
			mOnClick = onClick;
			mOnDrag = onDrag;
			mDragRezult = null;
		}

		internal void detach()
		{
			if (mState == State.Drag)
			{
//				mDragRezult.mEventDetach(pos);
				mDragRezult = null;
				mState = State.None;
			}
		}

		internal void down(Vec pos)
		{
			if(mState == State.None)
				mState = State.Down;
		}
		internal void up(Vec pos)
		{
			if (mState == State.Drag)
			{
				mDragRezult.mEventDetach(pos);
				mDragRezult = null;
			}
			if (mState == State.Down || mState == State.NoDrag)
			{
				if (mOnClick != null)
					mOnClick(pos);
			}
			mState = State.None;
		}
		internal void move(Vec pos)
		{
			switch (mState)
			{
				case State.Down:
					if (mOnDrag != null)
					{
						mDragRezult = mOnDrag(pos);
						if (mDragRezult == null)
						{
							mState = State.NoDrag;
						}
						else
						{
							mState = State.Drag;
						}
					}
					break;
				case State.Drag:
					mDragRezult.mEventMove(pos);
					break;
			}
		}
    }
}
