using System.Collections.Generic;
using System.Linq;

public class StateVar
{
	public readonly string Name;
	public readonly string[] ValueArray;
	public readonly List<string> ValueList;

	public StateVar(string name, string[] valueArray)
	{
		this.Name = name;
		this.ValueArray = valueArray;
		this.ValueList = valueArray.ToList();
	}


	public int GetValueIndex(string value)
	{
		return ValueList.IndexOf(value);
	}
}
