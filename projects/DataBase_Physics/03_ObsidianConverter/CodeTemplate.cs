namespace ObsidianConverter
{
	static class CodeTemplate
	{
		public static string Code1 =
			"<script type='text/Javascript'>\n" +
			"function {0}()\n" +
			"{\n" +
			"\tvar div = document.getElementById('{1}');\n" +
			"\tif (div.style.display === 'none')\n" +
			"\t\tdiv.style.display = 'block';\n" +
			"\telse\n" +
			"\t\tdiv.style.display = 'none';\n" +
			"}\n" +
			"</script>\n" +
			"<button onclick = '{0}()' > Show/Hide Code </button>\n" +
			"<div id='{1}' class='codeBlock'>\n";

		public static string Code2 =
			"</div>\n" +
			"<script type='text/Javascript'>\n" +
			"document.getElementById('{0}').style.display = 'none';\n" +
			"</script>\n";
	}
}
