using System.Collections.Generic;
using System.Linq;
using System;


namespace ProgLib
{
	public class WordReader
	{
		private readonly string Line;
		private readonly List<string> WordList;
		private int CurrentIndex;

		public WordReader(string line)
		{
			Line = line;
			WordList = Split(line);
			CurrentIndex = 0;
		}

		public string GetWord()
		{
			if (CurrentIndex >= WordList.Count)
				throw new Exception("Unexpected end of line\n" + Line);

			var result = WordList[CurrentIndex];
			CurrentIndex++;
			return result;
		}

		public bool IsEnd()
		{
			return CurrentIndex == WordList.Count;
		}

		public void GetWord(string keyword)
		{
			var result = GetWord();
			if (result != keyword)
				throw new Exception(string.Format("excepted: {0}, given: {1}", keyword, result));
		}

		public void GetEnd()
		{
			if (IsEnd() == false)
				throw new Exception("Waste words\n" + GetWord());
		}

		public int GetInt()
		{
			return int.Parse(GetWord());
		}

		private static List<string> Split(string line)
		{
			return line.Split(' ').Where(s => s != "").ToList();
		}

	}
}