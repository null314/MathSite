namespace ProgLib
{
	public struct Insight
	{
		public readonly int Day;
		public readonly IKnowledge Knowledge;

		public Insight(int day, IKnowledge knowledge)
		{
			Day = day;
			Knowledge = knowledge;
		}
	}
}