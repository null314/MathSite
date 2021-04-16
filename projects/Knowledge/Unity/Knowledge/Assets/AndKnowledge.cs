using System;
using System.Linq;
using State = System.Collections.Generic.List<int>;

public class CombineKnowledge : IKnowledge
{
	public readonly IKnowledge[] KnowledgeArray;

	public CombineKnowledge(IKnowledge[] knowledgeArray)
	{
		this.KnowledgeArray = knowledgeArray;
	}

	public Func<State, bool> Get(State stateTrue)
	{
		return (s) =>
		{
			return KnowledgeArray.All(f => f.Get(stateTrue)(s));
		};
	}
}
