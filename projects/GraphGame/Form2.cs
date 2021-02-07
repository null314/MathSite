using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NetRebuild
{
	public partial class Form2 : Form
	{
		private readonly Action<int, int, int, int, bool, bool> OnSelect;

		public Form2(Action<int, int, int, int, bool, bool> onSelect)
		{
			OnSelect = onSelect;
			InitializeComponent();

			comboBox1.SelectedIndex = 0;
			comboBox2.SelectedIndex = 1;
		}

		private void button1_Click(object sender, EventArgs e)
		{
			try
			{
				var count = int.Parse(textBox1.Text);
				var lineCount = int.Parse(textBox4.Text);
				var blueCount = int.Parse(textBox2.Text);
				var redCount = int.Parse(textBox3.Text);

				OnSelect(count, lineCount, blueCount, redCount, comboBox1.SelectedIndex == 1, comboBox2.SelectedIndex == 1);
				this.Hide();
			}
			catch (Exception ex)
			{

			}
		}

		private void textBox1_TextChanged(object sender, EventArgs e)
		{
		}
	}
}
