using System.Collections.Generic;
using State = System.Collections.Generic.List<int>;

public class Pers
{
	public readonly string Name;
	public readonly Dictionary<int, IKnowledge> KnowledgeDict = new Dictionary<int, IKnowledge>();
	public readonly Dictionary<int, IKnowledge> FullKnowledgeList = new Dictionary<int, IKnowledge>();
	public readonly Dictionary<string, Insight> InsightKnowledgeList = new Dictionary<string, Insight>();

	public Pers(string name)
	{
		Name = name;
	}

	public void AddInsightKnowledge(string kname, int day, IKnowledge knowledge)
	{
		InsightKnowledgeList.Add(kname, new Insight(day, knowledge));
	}

	public void AddDayKnowledge(int day, IKnowledge knowledge)
	{
		if (KnowledgeDict.ContainsKey(day))
		{
			var prevKnowlede = KnowledgeDict[day];
			KnowledgeDict[day] = new Combine2Knowledge(prevKnowlede, knowledge);
			return;
		}

		KnowledgeDict.Add(day, knowledge);
	}

	private IKnowledge GetFullKnowledge(int day)
	{
		if (FullKnowledgeList.ContainsKey(day))
			return FullKnowledgeList[day];

		var dayKnowledge = KnowledgeDict[day];
		if (day < 1)
			throw new System.Exception();

		if (day == 1)
			return dayKnowledge;

		var prevDayKnowledge = GetFullKnowledge(day - 1);
		var result = new Combine2Knowledge(prevDayKnowledge, dayKnowledge);

		FullKnowledgeList.Add(day, result);
		return result;
	}

	public bool ExistInsight(string insightName, int day)
	{
		return day >= InsightKnowledgeList[insightName].Day;
	}

	public IProp<bool> GetInsight(string insightName, int day, List<State> fullState)
	{
		var insightKnowledge = InsightKnowledgeList[insightName];
		if (ExistInsight(insightName, day) == false)
			throw new System.Exception(string.Format(
				"Insigh '{0}.{1}' (day {2}) does not exist at day {3}", Name, insightName, insightKnowledge.Day, day));

		var insight = new ImplyStateInfo(GetFullKnowledge(day), insightKnowledge.Knowledge, fullState);
		return insight;
	}
}