namespace Net
{
	public class DragRezult
	{
		public delegate void EventPos(Vec pos);

		internal EventPos mEventMove;
		internal EventPos mEventDetach;

		public DragRezult(EventPos eventMove, EventPos eventDetach)
		{
			mEventMove = eventMove;
			mEventDetach = eventDetach;
		}

	}
}
