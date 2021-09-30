using System;

namespace ProgLib
{
	public class ParseException : Exception
	{
		public readonly string Line;
		public readonly Exception Exception;
		public ParseException(string line, Exception exception)
		{
			Line = line;
			Exception = exception;
		}
	}
}