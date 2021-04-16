using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;




namespace ObsidianConverter
{
	class Program
	{
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
				ConvertFile(pair.Key, pair.Value.InFile, pair.Value.OutFile, dict, templateLine);
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

		private static void ConvertFile(string justName, string inPath, string outPath, Dictionary<string, FileInfo2> dict, string[] templateLineArray)
		{
			var file = new FileInfo(outPath);
			file.Directory.Create();

			using (var fw = new StreamWriter(outPath))
			{
				foreach (var templateLine in templateLineArray)
				{
					if (templateLine == "{content}")
					{
						WriteContent(fw, inPath, dict);
					}
					else
					{
						var l = templateLine.Replace("{title}", justName);
						fw.WriteLine(l);
					}
				}
			}
		}

		private static void WriteContent(StreamWriter fw, string inPath, Dictionary<string, FileInfo2> dict)
		{
			var lines = File.ReadAllLines(inPath);
			var codeScopeType = CodeScopeType.None;
			var codeContent = "";
			var listStarted = false;

			foreach (var line in lines)
			{
//				Console.WriteLine(line);

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

	}
}
