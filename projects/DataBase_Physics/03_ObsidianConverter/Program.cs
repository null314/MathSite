using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;




namespace ObsidianConverter
{
	class Program
	{
		private const string MainClass = "main";
		private const string BodyClass = "body";
		private const string TypeClass = "typeClass";
		private const string ScopeClass = "scope";
		private const string CommentClass = "comment";

		static void Main(string[] args)
		{
			if (args.Length != 3)
			{
				Console.WriteLine("Needed params: inPath, outPath, templatePath");
				return;
			}

			try
			{
				ConvertAll(args[0], args[1], args[2]);
				Console.WriteLine("Obsidian conversion complete!");
			}
			catch (Exception e)
			{
				Console.WriteLine("Exception while conversion\n" + e.ToString());
			}

		}


		private static void ConvertAll(string inPath, string outPath, string templatePath)
		{
			var dict = new Dictionary<string, FileInfo2>();

			var templateLine = File.ReadAllLines(templatePath);

			foreach (var inFile in TraverseFiles(inPath).Where(IsMarkDownFile))
			{
				var hrefFile = inFile.Replace(inPath, "").Replace(".md", ".html");

				var justName = Path.GetFileNameWithoutExtension(Path.GetFileName(inFile));
				var htmlWithoutExtension = Path.GetFileName(hrefFile);
				var outFile = outPath + hrefFile;

				if (dict.ContainsKey(justName))
				{
					throw new Exception("Duplicate file name '" + justName + "'");
				}

				dict.Add(justName, new FileInfo2
				{
					InFile = inFile,
					OutFile = outFile,
					HrefFile = hrefFile,
				});

			}

			foreach (var pair in dict)
			{
				Console.WriteLine("convertion: " + pair.Value.InFile);
				ConvertFile(inPath, pair.Key, pair.Value.InFile, pair.Value.OutFile, dict, templateLine);
				Console.WriteLine("complete");
			}


			//		}
		}

		private static bool IsMarkDownFile(string path)
		{
			return path.EndsWith(".md");
		}

		private static IEnumerable<string> TraverseFiles(string path)
		{
			foreach (var f in Directory.GetFiles(path))
			{
				yield return f;
			}
			foreach (var f in Directory.GetDirectories(path))
			{
				foreach (var sf in TraverseFiles(f))
					yield return sf;
			}
		}

		private static void ConvertFile(string inPath, string justName, string inFile, string outPath, Dictionary<string, FileInfo2> dict, string[] templateLineArray)
		{
			var file = new FileInfo(outPath);
			file.Directory.Create();

			using (var fw = new StreamWriter(outPath))
			{
				foreach (var templateLine in templateLineArray)
				{
					if (templateLine == "{content}")
					{
						WriteContent(fw, inPath, inFile, dict);
					}
					else
					{
						var l = templateLine.Replace("{title}", justName);
						fw.WriteLine(l);
					}
				}
			}
		}

		private static void WriteContent(StreamWriter fw, string inPath, string inFile, Dictionary<string, FileInfo2> dict)
		{
			var codeInsertIndex = 1;
			var lines = File.ReadAllLines(inFile);
			var codeScopeType = CodeScopeType.None;
			var codeContent = "";
			var listStarted = false;

			foreach (var line in lines)
			{
				Console.WriteLine(line);

				if (line.StartsWith("```") && codeScopeType != CodeScopeType.None)
				{
					WriteCode(codeScopeType, codeContent, fw);
					codeScopeType = CodeScopeType.None;
					codeContent = null;
					continue;
				}
				if (codeScopeType != CodeScopeType.None)
				{
					codeContent += line + "\n";
					continue;
				}

				if (line.StartsWith("```js"))
				{
					codeScopeType = CodeScopeType.Js;
					codeContent = "";
					continue;
				}

				if (line.StartsWith("```html"))
				{
					codeScopeType = CodeScopeType.Html;
					codeContent = "";
					continue;
				}

				if (line.StartsWith("```e"))
				{
					var command = line.Substring(5, line.Length - 5 - 3);
					ExecuteCommand(command, fw, inPath, codeInsertIndex);
					codeInsertIndex++;
					continue;
				}

				if (line.All(c => c == ' '))
					continue;


				if (WithString(line, "$$ ", (l) =>
				{
					if (line.EndsWith("$$") == false)
						fw.WriteLine("FORMULA ERROR");
					else
						fw.WriteLine("\\[ " + l.Substring(0, l.Length - 2) + "\\]");


				}))
				{
					continue;
				}

				if (WithString(line, "# ", (l) =>
				{
					fw.WriteLine("<H1>" + l + "</H1>");
				}))
				{
					continue;
				}
				if (WithString(line, "# ", (l) =>
				{
					fw.WriteLine("<H1>" + l + "</H1>");
				}))
				{
					continue;
				}
				if (WithString(line, "## ", (l) =>
				{
					fw.WriteLine("<H2>" + l + "</H2>");
				}))
				{
					continue;
				}
				if (WithString(line, "### ", (l) =>
				{
					fw.WriteLine("<H3>" + l + "</H3>");
				}))
				{
					continue;
				}
				if (WithString(line, "#### ", (l) =>
				{
					fw.WriteLine("<H4>" + l + "</H4>");
				}))
				{
					continue;
				}
				if (WithString(line, "##### ", (l) =>
				{
					fw.WriteLine("<H5>" + l + "</H5>");
				}))
				{
					continue;
				}
				if (WithString(line, "###### ", (l) =>
				{
					fw.WriteLine("<H6>" + l + "</H6>");
				}))
				{
					continue;
				}

				if (WithString(line, "- ", (l) =>
				{
					if (listStarted == false)
					{
						fw.WriteLine("<ul>");
						listStarted = true;
					}

					fw.WriteLine("\t<li>" + ReplaceLink(l, dict) + "</li>");
				}))
				{
					continue;
				}

				if (listStarted)
				{
					fw.WriteLine("</ul>");
					listStarted = false;
				}

				fw.WriteLine("<p>" + ReplaceLink(line, dict) + "</p>");
			}

			if (listStarted)
			{
				fw.WriteLine("</ul>");
				listStarted = false;
			}
		}


		private static void WriteCode(CodeScopeType codeScopeType, string codeContent, StreamWriter fw)
		{
			if (codeScopeType == CodeScopeType.Js)
			{
				fw.WriteLine("<script type='text/Javascript'>");
				fw.WriteLine(codeContent);
				fw.WriteLine("</script>");
			}

			if (codeScopeType == CodeScopeType.Html)
			{
				fw.WriteLine(codeContent);
			}
		}

		private static string ReplacePattern(string line, string startPattern, string endPattern, Func<string, string> func)
		{
			var end = false;

			do
			{
				var startIndex = line.IndexOf(startPattern);
				if (startIndex >= 0)
				{
					var endIndex = line.IndexOf(endPattern, startIndex + startPattern.Length);
					var content = line.Substring(startIndex + startPattern.Length, endIndex - startIndex - startPattern.Length);
					line = line.Remove(startIndex, endIndex + endPattern.Length - startIndex);
					var newContent = func(content);
					line = line.Insert(startIndex, newContent);

					end = false;
				}
				else
					end = true;

			} while (end == false);

			return line;
		}

		private static string ReplaceLink(string line, Dictionary<string, FileInfo2> dict)
		{
			line = ReplacePattern(line, "$", "$", (s) => "\\(" + s + "\\)");

			return ReplacePattern(line, "[[", "]]", (link) =>
			{
				var lineIndex = link.IndexOf("|");

				var hasLine = lineIndex >= 0;
				var linkName = hasLine ? link.Substring(lineIndex + 1, link.Length - lineIndex - 1) : link;

				var mdFile = hasLine ?
					link.Substring(0, lineIndex) :
					link;

				if (dict.ContainsKey(mdFile) == false)
				{
					Console.WriteLine("ERROR!! No file " + Envelope(mdFile));
					return "ERROR LINK " + mdFile;
				}
				else
				{
					var fileInfo = dict[mdFile];
					var href = fileInfo.HrefFile;

					return string.Format("<a href='{0}'>{1}</a>", href, linkName);
				}
			}); 

		}


		private static bool WithString(string line, string suffix, Action<string> func)
		{
			if (line.StartsWith(suffix))
			{
				func(line.Substring(suffix.Length));
				return true;
			}

			return false;
		}

		private static string Envelope(string s)
		{
			return "'" + s + "'";
		}


		private static void ExecuteCommand(string command, StreamWriter fw, string inPath, int index)
		{
			var wordArray = command.Split(' ');
			if (wordArray[0] == "insertCode")
			{
				var file = wordArray[2];
				var content = File.ReadAllLines(inPath + file);

				var divName = "codeDiv" + index;
				var functionName = "codeShowHide" + index;

				var lineCount = 0;

//				Console.Write(CodeTemplate.Code1.Replace("{0}", functionName).Replace("{1}", divName));
				fw.Write(CodeTemplate.Code1.Replace("{0}", functionName).Replace("{1}", divName));
				fw.WriteLine("<table>");
				foreach (var line in content)
				{
					var code = FormatingCode(wordArray[1], line);
					fw.WriteLine(string.Format("<tr><td><pre>{1}</pre></dt><tr>", lineCount, code));
//					fw.WriteLine(string.Format("<pre>{1}</pre>", lineCount, code));
					lineCount++;
				}
				fw.WriteLine("</table>");
				fw.Write(CodeTemplate.Code2.Replace("{0}", divName));
			}

		}

		private static string ReplaceKeyword(string code, string keyword, string className)
		{
			return SmartReplace(
				code,
				keyword,
				null,
				true,
				true,
				(c1, c2) => IsAlphabet(c1) == false && IsAlphabet(c2) == false,
				(word) => string.Format("<span cluss=\"{0}\">{1}</span>", className, word));
		}

		private static bool IsAlphabet(char c)
		{
			return (c >= 'a' && c <= 'z') ||
				(c >= 'A' && c <= 'Z') ||
				(c >= '0' && c <= '9') ||
				c == '_';
		}

		private static string ReplaceScope(string code, string className, char scopeChar)
		{
			return SmartReplace(
				code,
				scopeChar.ToString(),
				new char[]{ scopeChar},
				true,
				true,
				(c1, c2) => true,
				(word) => string.Format("<span cluss=\"{0}\">{1}</span>", className, word));
		}

		private static string SmartReplace(string code, string start, char[] end, bool includeFirst, bool includeLast, Func<char, char, bool> check, Func<string, string> replace)
		{
			var result = "";
			var i = 0;
			do
			{
				i = code.IndexOf(start);
				if (i >= 0)
				{
					var o = end != null ? code.IndexOfAny(end, i+1) : i + start.Length - 1;
					if (o < 0)
						o = code.Length - 1;
					else
					{
						if (includeLast == false)
							o--;

						if (includeFirst == false)
							i += start.Length;
					}

					result += code.Substring(0, i);

					var c1 = i > 0 ? code[i - 1] : ' ';
					var c2 = o < code.Length-2 ? code[o + 1] : ' ';
					if (check(c1, c2))
						result += replace(code.Substring(i, o - i + 1));
					else
						result += code.Substring(i, o - i + 1);

					code = code.Substring(o+1);
				}
			}while(i >= 0);
			return result + code;
		}

		private static string FormatingCode(string format, string code)
		{
			if (format == "TypeScript" || format == "JavaScript")
			{
				if (code.StartsWith("//"))
					code = string.Format("<span class=\"{0}\">{1}</span>", CommentClass, code);
				else
				{

					code = ReplaceScope(code, ScopeClass, '\"');
					code = ReplaceScope(code, ScopeClass, '\'');
					code = ReplaceKeyword(code, "abstract", MainClass);
					code = ReplaceKeyword(code, "class", MainClass);
					code = ReplaceKeyword(code, "extends", MainClass);
					code = ReplaceKeyword(code, "constructor", MainClass);
					code = ReplaceKeyword(code, "enum", MainClass);
					code = ReplaceKeyword(code, "Object", BodyClass);
					code = ReplaceKeyword(code, "super", BodyClass);
					code = ReplaceKeyword(code, "function", BodyClass);
					code = ReplaceKeyword(code, "this", BodyClass);
					code = ReplaceKeyword(code, "new", BodyClass);
					code = ReplaceKeyword(code, "var", BodyClass);
					code = ReplaceKeyword(code, "for", BodyClass);
					code = ReplaceKeyword(code, "null", BodyClass);
					code = ReplaceKeyword(code, "return", BodyClass);
					code = ReplaceKeyword(code, "const", BodyClass);
					code = ReplaceKeyword(code, "string", TypeClass);
					code = ReplaceKeyword(code, "number", TypeClass);
					code = ReplaceKeyword(code, "boolean", TypeClass);
					code = ReplaceKeyword(code, "void", TypeClass);
					code = code.Replace("cluss", "class");
				}
			}

			if (format == "Html")
			{
				code = code.Replace("<", "&lt;");
				code = code.Replace(">", "&gt;");
				code = ReplaceScope(code, ScopeClass, '\"');
				code = ReplaceScope(code, ScopeClass, '\'');
				code = SmartReplace(
					code, 
					"&lt;", 
					new char[] { ' ', '&' }, 
					false,
					false,
					(c1, c2) => true, 
					(word) => string.Format("<span cluss=\"{0}\">{1}</span>", MainClass, word));
				code = ReplaceKeyword(code, "id", TypeClass);
				code = ReplaceKeyword(code, "src", TypeClass);
				code = ReplaceKeyword(code, "type", TypeClass);
				code = ReplaceKeyword(code, "width", TypeClass);
				code = ReplaceKeyword(code, "height", TypeClass);
				code = code.Replace("cluss", "class");
			}

			return code;
		}
	}
}
