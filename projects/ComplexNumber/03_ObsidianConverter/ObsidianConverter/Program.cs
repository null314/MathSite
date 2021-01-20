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
			if (args.Length != 3 && args.Length != 2)
			{
				Console.WriteLine("Needed params: inPath, outPath, prefixPath (optional)");
				return;
			}

			try
			{
				ConvertAll(args[0], args[1], args.Length == 3 ? args[2] : "");
				Console.WriteLine("Obsidian conversion complete!");
			}
			catch (Exception e)
			{
				Console.WriteLine("Exception while conversion\n" + e.ToString());
			}

		}


		private static void ConvertAll(string inPath, string outPath, string subpath)
		{
			var dict = new Dictionary<string, FileInfo2>();

			foreach (var inFile in TraverseFiles(inPath).Where(IsMarkDownFile))
			{
				Console.WriteLine(inFile);

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
				ConvertFile(pair.Value.InFile, pair.Value.OutFile, dict, subpath);
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

		private static void ConvertFile(string inPath, string outPath, Dictionary<string, FileInfo2> dict, string subpath)
		{
			var lines = File.ReadAllLines(inPath);

			var file = new FileInfo(outPath);
			file.Directory.Create();

			var codeScopeType = CodeScopeType.None;
			var codeContent = "";

			using (var fw = new StreamWriter(outPath))
			{
				fw.WriteLine("<!DOCTYPE html>");
				fw.WriteLine("<html>");
				fw.WriteLine("<head>");
				fw.WriteLine("<title>title</title>");
				fw.WriteLine("</head>");
				fw.WriteLine("<body>");

				var listStarted = false;

				foreach (var line in lines)
				{
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

						fw.WriteLine("\t<li>" + ReplaceLink(l, dict, subpath) + "</li>");


					}))
					{
						continue;
					}

					if (listStarted)
					{
						fw.WriteLine("</ul>");
						listStarted = false;
					}

					fw.WriteLine("<p>" + ReplaceLink(line, dict, subpath) + "</p>");
				}
				fw.WriteLine("</body>");
				fw.WriteLine("</html>");
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


		private static string ReplaceLink(string line, Dictionary<string, FileInfo2> dict, string subpath)
		{
			var end = false;

			do
			{
				var startIndex = line.IndexOf("[[");

				if (startIndex >= 0)
				{
					var endIndex = line.IndexOf("]]", startIndex);
					var sharpIndex = line.IndexOf("#", startIndex);
					var lineIndex = line.IndexOf("|", startIndex);

					var hasLine = lineIndex > startIndex && lineIndex < endIndex;

					var linkName = hasLine ?
						line.Substring(lineIndex + 1, endIndex - lineIndex - 1) :
						line.Substring(startIndex + 2, endIndex - startIndex - 2);

					var mdFile = hasLine ?
						line.Substring(startIndex + 2, lineIndex - startIndex - 2) :
						line.Substring(startIndex + 2, endIndex - startIndex - 2);
					var removed = line.Remove(startIndex, endIndex - startIndex + 2);

					if (dict.ContainsKey(mdFile) == false)
					{
						Console.WriteLine("ERROR!! No file " + Envelope(mdFile));
						end = true;
					}
					else
					{
						var fileInfo = dict[mdFile];
						var href = subpath + fileInfo.HrefFile;

						line = removed.Insert(startIndex, string.Format("<a href='{0}'>{1}</a>", href, linkName));
						end = false;
					}
				}
				else
					end = true;

			} while (end == false);

			return line;
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
