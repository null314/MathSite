using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using State = System.Collections.Generic.List<int>;
using System.IO;
using System;
using InterfacesLib;
using UnityEngine.UI;

namespace ProgLib
{
	public class Prog: IProg
	{
		private readonly List<StateVar> StateVarList = new List<StateVar>();
		private readonly List<Pers> PersList = new List<Pers>();
		private readonly Dictionary<string, IProp<int>> PropIntDict = new Dictionary<string, IProp<int>>();
		private readonly Dictionary<string, IProp<bool>> PropBoolDict = new Dictionary<string, IProp<bool>>();
		private readonly Dictionary<string, IKnowledge> KnowledgeDict = new Dictionary<string, IKnowledge>();

		private readonly GameObject InputFieldGo;
		private readonly GameObject ResultGo;
		private readonly GameObject ButtonExecute;
		private readonly GameObject ButtonEdit;


		public string LogString;
		private List<State> FullState;
		private State State;




		public Prog()
		{
			ButtonExecute = GameObject.Find("ButtonExecute");
			ButtonEdit = GameObject.Find("ButtonEdit");
			InputFieldGo = GameObject.Find("InputField");
			ResultGo = GameObject.Find("Result");
			ResultGo.SetActive(false);
			ButtonEdit.SetActive(false);

			ButtonExecute.GetComponent<Button>().onClick.AddListener(OnPressExecute);
			ButtonEdit.GetComponent<Button>().onClick.AddListener(OnPressEdit);
			GameObject.Find("ButtonSave").GetComponent<Button>().onClick.AddListener(() => 
			{
				PlayerPrefs.SetString("Data", InputFieldGo.GetComponent<InputField>().text);
			});
			GameObject.Find("ButtonLoad").GetComponent<Button>().onClick.AddListener(() => 
			{
				InputFieldGo.GetComponent<InputField>().text = PlayerPrefs.GetString("Data");
			});
		}

		private void OnPressEdit()
		{
			ButtonEdit.SetActive(false);
			ButtonExecute.SetActive(true);
			InputFieldGo.SetActive(true);
			ResultGo.SetActive(false);

			LogString = "";
			StateVarList.Clear();
			PersList.Clear();
			PropIntDict.Clear();
			PropBoolDict.Clear();
			KnowledgeDict.Clear();
		}

		private void OnPressExecute()
		{
			var text = InputFieldGo.GetComponent<InputField>().text;

			Execute(text);
			ResultGo.GetComponent<InputField>().text = LogString;

			ButtonEdit.SetActive(true);
			ButtonExecute.SetActive(false);
			InputFieldGo.SetActive(false);
			ResultGo.SetActive(true);
		}

		private void Log(string s)
		{
			LogString += s + "\n";
		}

		public void OnGui()
		{
//			GUILayout.Label("Hello");
//			GUILayout.Label(LogString);
		}

		public static List<State> GenerateFullStateList(List<StateVar> stateVarList)
		{
			var result = new List<State> { new State() };

			foreach (var stateVar in stateVarList)
			{
				var newResult = new List<State>();

				foreach (var i in stateVar.ValueArray.Length.Traverse())
				{
					var copy = result.Select(s =>
					{
						var r = new State(s);
						r.Add(i);
						return r;
					});
					newResult.AddRange(copy);
				}

				result = newResult;
			}

			return result;
		}


		const string StateVarKeyword = "stateVar";
		const string PersKeyword = "pers";
		const string StateKeyword = "state";
		const string PropIntKeyword = "propInt";
		const string PropBoolKeyword = "propBool";
		const string KnowledgeKeyword = "knowledge";
		const string ListKeyword = "list";
		const string GetKeyword = "get";
		const string ConstKeyword = "const";
		const string EqualKeyword = "equal";
		const string OrKeyword = "or";
		const string AboutIntKeyword = "aboutInt";
		const string AboutBoolKeyword = "aboutBool";
		const string IsTrueKeyword = "isTrue";
		const string CombineKeyword = "combine";
		const string PersInsightKeyword = "persInsight";
		const string DayKnowledgeKeyword = "dayKnowledge";
		const string InsightKeyword = "insight";
		const string PrintPersInsightKeyword = "printPersInsight";
		const string PrintPropIntKeyword = "printPropInt";
		const string PrintPropBoolKeyword = "printPropBool";
		const string PrintPropBoolTrueKeyword = "printPropBoolTrue";
		const string PrintPropBoolFalseKeyword = "printPropBoolFalse";
		const string PrintKnowledgeKeyword = "printKnowledge";
		const string PrintKnowledgeTrueKeyword = "printKnowledgeTrue";
		const string PrintKnowledgeFalseKeyword = "printKnowledgeFalse";
		const string DayKeyword = "day";
		const string LineCommentKeyword = "//";
		const string CommentStartKeyword = "/*";
		const string CommentEndKeyword = "*/";

		public void LoadFile(string fileName)
		{
			Execute(File.ReadAllText(fileName));
		}

		public void Execute(string content)
		{
			try
			{
				var comment = false;
				var lineArray = content.Split('\n');

				foreach (var line in lineArray)
				{
					try
					{

						var wordReader = new WordReader(line);
						if (wordReader.IsEnd())
							continue;

						var word = wordReader.GetWord();

						if (word == CommentEndKeyword && comment)
						{
							comment = false;
						}
						else if (comment)
						{
						}
						else if (word == CommentStartKeyword)
						{
							comment = true;
						}
						else if (word == LineCommentKeyword)
						{
						}
						else if (word == StateVarKeyword)
						{
							ParseStateVar(wordReader);
						}
						else if (word == PersKeyword)
						{
							ParsePers(wordReader);
						}
						else if (word == StateKeyword)
						{
							ParseState(wordReader);
						}
						else if (word == PropIntKeyword)
						{
							ParsePropIntVar(wordReader);
						}
						else if (word == PropBoolKeyword)
						{
							ParsePropBoolVar(wordReader);
						}
						else if (word == KnowledgeKeyword)
						{
							ParseKnowledgeVar(wordReader);
						}
						else if (word == DayKnowledgeKeyword)
						{
							ParseDayKnowledge(wordReader);
						}
						else if (word == InsightKeyword)
						{
							ParseInsight(wordReader);
						}
						else if (word == PrintPersInsightKeyword)
						{
							ParsePrintPersInsight(wordReader);
						}
						else if (word == PrintPropIntKeyword)
						{
							ParsePrintPropInt(wordReader);
						}
						else if (word == PrintPropBoolKeyword)
						{
							ParsePrintPropBool(wordReader, (b) => true);
						}
						else if (word == PrintPropBoolTrueKeyword)
						{
							ParsePrintPropBool(wordReader, (b) => b);
						}
						else if (word == PrintPropBoolFalseKeyword)
						{
							ParsePrintPropBool(wordReader, (b) => !b);
						}
						else if (word == PrintKnowledgeKeyword)
						{
							ParsePrintKnowledge(wordReader, (b) => true);
						}
						else if (word == PrintKnowledgeTrueKeyword)
						{
							ParsePrintKnowledge(wordReader, (b) => b);
						}
						else if (word == PrintKnowledgeFalseKeyword)
						{
							ParsePrintKnowledge(wordReader, (b) => !b);
						}
						else
						{
//							Debug.LogError(line);
							Log("Strange line: " + line);
						}

					}
					catch (Exception e)
					{
						throw new ParseException(line, e);
					}
				}
			}
			catch (ParseException e)
			{
				Log("");
				Log("Error: " + e.Exception.Message);
				Log("");
				Log("Code line: " + e.Line);
				Debug.LogError(e.Exception);
			}
		}

		private void ParseStateVar(WordReader wordReader)
		{
			var name = wordReader.GetWord();
			var valueList = ParseList<string>(wordReader, ParseString);
			wordReader.GetEnd();

			AddStateVar(name, valueList);
		}

		private void ParsePers(WordReader wordReader)
		{
			var name = wordReader.GetWord();
			wordReader.GetEnd();

			AddPers(name);
		}

		private void ParseState(WordReader wordReader)
		{
			var valueList = ParseList<string>(wordReader, ParseString);
			wordReader.GetEnd();

			var result = new State();
			foreach (var i in valueList.Length.Traverse())
			{
				result.Add(StateVarList[i].GetValueIndex(valueList[i]));
			}

			SetState(result);
		}

		private void ParsePropIntVar(WordReader wordReader)
		{
			var name = wordReader.GetWord();
			wordReader.GetWord("=");

			var prop = ParsePropInt(wordReader);
			wordReader.GetEnd();

			AddPropInt(name, prop);
		}

		private void ParsePropBoolVar(WordReader wordReader)
		{
			var name = wordReader.GetWord();
			wordReader.GetWord("=");

			var prop = ParsePropBool(wordReader);
			wordReader.GetEnd();

			AddPropBool(name, prop);
		}

		private void ParseDayKnowledge(WordReader wordReader)
		{
			var persIndex = ParsePersIndex(wordReader);
			var day = ParseDay(wordReader);
			var knowledge = ParseKnowledge(wordReader);
			wordReader.GetEnd();

			AddDayKnowledge(persIndex, day, knowledge);
		}

		private void ParseInsight(WordReader wordReader)
		{
			var persIndex = ParsePersIndex(wordReader);
			var day = ParseDay(wordReader);
			var insightName = wordReader.GetWord();
			var knowledge = ParseKnowledge(wordReader);
			wordReader.GetEnd();

			AddInsightKeyword(persIndex, day, insightName, knowledge);
		}

		private void ParseKnowledgeVar(WordReader wordReader)
		{
			var name = wordReader.GetWord();
			wordReader.GetWord("=");

			var prop = ParseKnowledge(wordReader);
			wordReader.GetEnd();

			AddKnowledge(name, prop);
		}

		private IKnowledge ParseKnowledge(WordReader wordReader)
		{
			var word = wordReader.GetWord();

			if (word[0] == '&')
			{
				return KnowledgeDict[word];
			}
			if (word == AboutIntKeyword)
			{
				var propInt = ParsePropInt(wordReader);
				return new AboutKnowledge<int>(propInt, new IntComparer());
			}
			if (word == AboutBoolKeyword)
			{
				var propBool = ParsePropBool(wordReader);
				return new AboutKnowledge<bool>(propBool, new BoolComparer());
			}
			if (word == IsTrueKeyword)
			{
				var propBool = ParsePropBool(wordReader);
				return new IsTrueKnowledge(propBool);
			}
			if (word == CombineKeyword)
			{
				var knowledgeArray = ParseList<IKnowledge>(wordReader, ParseKnowledge);
				return new CombineKnowledge(knowledgeArray);
			}
			else
				throw new Exception(word);
		}

		private IProp<int> ParsePropInt(WordReader wordReader)
		{
			var word = wordReader.GetWord();

			if (word[0] == '$')
			{
				return PropIntDict[word];
			}
			if (word == GetKeyword)
			{
				var stateVarName = wordReader.GetWord();
				var stateVarIndex = GetStateVarIndex(stateVarName);
				return new GetProp(stateVarIndex);
			}
			if (word == ConstKeyword)
			{
				var stateVarName = wordReader.GetWord();
				var value = wordReader.GetWord();
				return new ConstProp(GetStateVarValueIndex(stateVarName, value));
			}
			else
				throw new Exception(word);
		}

		private IProp<bool> ParsePropBool(WordReader wordReader)
		{
			var word = wordReader.GetWord();

			if (word[0] == '$')
			{
				return PropBoolDict[word];
			}
			if (word == EqualKeyword)
			{
				var prop1 = ParsePropInt(wordReader);
				var prop2 = ParsePropInt(wordReader);
				return new EqualProp(prop1, prop2);
			}
			if (word == OrKeyword)
			{
				var list = ParseList(wordReader, ParsePropBool);
				return new OrProp(list);
			}
			if (word == PersInsightKeyword)
			{
				var persIndex = ParsePersIndex(wordReader);
				var day = ParseDay(wordReader);
				var insightName = wordReader.GetWord();
				return PersList[persIndex].GetInsight(insightName, day, GetFullState());
			}
			else
				throw new Exception(string.Format("Can't parse PropBool '{0}'", word));
		}

		private int ParsePersIndex(WordReader wordReader)
		{
			var persName = wordReader.GetWord();
			var persIndex = PersList.FindIndex(p => p.Name == persName);
			return persIndex;
		}

		private int ParseDay(WordReader wordReader)
		{
			var word = wordReader.GetWord();
			if (word.StartsWith(DayKeyword) == false)
				throw new Exception();

			return int.Parse(word.Substring(DayKeyword.Length));
		}

		private void ParsePrintPersInsight(WordReader wordReader)
		{
			var persIndex = ParsePersIndex(wordReader);
			var day = ParseDay(wordReader);
			wordReader.GetEnd();

			PrintPersInsight(persIndex, day);
		}

		private void ParsePrintPropInt(WordReader wordReader)
		{
			var propInt = ParsePropInt(wordReader);
			wordReader.GetEnd();

			PrintPropInt(propInt);
		}

		private void ParsePrintPropBool(WordReader wordReader, Func<bool, bool> filter)
		{
			var propBool = ParsePropBool(wordReader);
			wordReader.GetEnd();

			PrintPropBool(propBool, filter);
		}

		private void ParsePrintKnowledge(WordReader wordReader, Func<bool, bool> filter)
		{
			var knowledge = ParseKnowledge(wordReader);
			wordReader.GetEnd();

			PrintKnowledge(knowledge, filter);
		}

		private T[] ParseList<T>(WordReader wordReader, Func<WordReader, T> reader)
		{
			wordReader.GetWord(ListKeyword);
			var count = wordReader.GetInt();
			var result = new T[count];

			foreach (var i in count.Traverse())
			{
				result[i] = reader(wordReader);
			}

			return result;
		}

		private static string ParseString(WordReader wordReader)
		{
			return wordReader.GetWord();
		}






		private void AddStateVar(string name, string[] valueList)
		{
			StateVarList.Add(new StateVar(name, valueList));
		}

		private void AddPers(string name)
		{
			PersList.Add(new Pers(name));
		}

		private void SetState(State state)
		{
			State = state;
		}

		private int GetStateVarIndex(string stateVarName)
		{
			return StateVarList.FindIndex(sv => sv.Name == stateVarName);
		}

		private IProp<int> AddPropInt(string varName, IProp<int> prop)
		{
			Debug.Log("propInt " + varName);
			PropIntDict.Add(varName, prop);
			return prop;
		}

		private IProp<bool> AddPropBool(string varName, IProp<bool> prop)
		{
			Debug.Log("propBool " + varName);
			PropBoolDict.Add(varName, prop);
			return prop;
		}

		private IKnowledge AddKnowledge(string varName, IKnowledge knowledge)
		{
			Debug.Log("knowledge " + varName);
			KnowledgeDict.Add(varName, knowledge);
			return knowledge;
		}

		private int GetStateVarValueIndex(string stateVarName, string value)
		{
			var stateVar = StateVarList.First(sv => sv.Name == stateVarName);
			return stateVar.GetValueIndex(value);
		}

		private void AddDayKnowledge(int persIndex, int day, IKnowledge knowledge)
		{
			PersList[persIndex].AddDayKnowledge(day, knowledge);
			Debug.Log("addKnowledge " + PersList[persIndex].Name + " day " + day);
		}

		private void AddInsightKeyword(int persIndex, int day, string insightName, IKnowledge knowledge)
		{
			PersList[persIndex].AddInsightKnowledge(insightName, day, knowledge);
			Debug.Log("insight " + PersList[persIndex].Name + " " + insightName);
		}


		private List<State> GetFullState()
		{
			if (FullState == null)
				FullState = GenerateFullStateList(StateVarList);

			return FullState;
		}

		private void PrintPersInsight(int persIndex, int day)
		{
			var pers = PersList[persIndex];
			Log(pers.Name + " day " + day);

			foreach (var insightName in pers.InsightKnowledgeList.Keys)
			{
				if (pers.ExistInsight(insightName, day))
				{
					var insight = pers.GetInsight(insightName, day, GetFullState());
					var result = insight.Get(State);
					Log("\t" + insightName + ": " + result.ToString());
				}
			}
		}

		private void PrintPropInt(IProp<int> propInt)
		{
			Log("PropInt: ");

			foreach (var state in GetFullState())
			{
				var result = propInt.Get(state);
				Log("\t" + PrintState(state) + " -> " + result.ToString());
			}
		}

		private void PrintPropBool(IProp<bool> propBool, Func<bool, bool> filter)
		{
			Log("PropBool: ");

			foreach (var state in GetFullState())
			{
				var result = propBool.Get(state);
				if (filter(result))
					Log("\t" + PrintState(state) + " -> " + (result ? "True" : "False"));
			}
		}

		private void PrintKnowledge(IKnowledge knowledge, Func<bool, bool> filter)
		{
			Log("Knowledge: ");

			foreach (var state in GetFullState())
			{
				Log("\t" + PrintState(state) + ":");
				var fun = knowledge.Get(state);

				if (GetFullState().Any(s => filter(fun(s))))
				{
					if (GetFullState().All(s => fun(s)))
					{
						Log("\t\t... -> True");
					}
					else if (GetFullState().All(s => fun(s) == false))
					{
						Log("\t\t... -> False");
					}
					else
					{
						foreach (var state2 in GetFullState())
						{
							var result = fun(state2);
							if (filter(result))
								Log("\t\t" + PrintState(state2) + " -> " + (result ? "True" : "False"));
						}
					}
				}
			}
		}

		private string PrintState(State state)
		{
			var result = "";
			foreach (var i in state.Count.Traverse())
			{
				if (i != 0)
					result += " ";
				result += StateVarList[i].ValueArray[state[i]];
			}
			return result;
		}

		private IProp<bool> GetPropBool(string name)
		{
			if (PropBoolDict.ContainsKey(name) == false)
				throw new Exception(string.Format("There is no PropBool with name '{0}'", name));

			return PropBoolDict[name];
		}

		private IProp<int> GetPropInt(string name)
		{
			if (PropIntDict.ContainsKey(name) == false)
				throw new Exception(string.Format("There is no PropInt with name '{0}'", name));

			return PropIntDict[name];
		}
	}
}