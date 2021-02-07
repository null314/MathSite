using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Net;

namespace NetRebuild
{
	public partial class Form1 : Form
	{
		Net.Net mNet;
		Form2 Form2;
		bool Wait;

		public Form1()
		{
			InitializeComponent();

			Form2 = new Form2(OnSelectGameMode);
			Form2.TopMost = true;

			mTimer = new Timer();
			this.DoubleBuffered = true;
			newGame();
		}

		void newGame()
		{
			mNet = null;
			Form2.Show();

/*			mNet = new Net.Net(
				delegate (String s) { this.Text = s; return true; },
				new ControllerPlayer(win("Blue player win!")),
				new ControllerComp(win("Red player win!")),
				9, 3, 3, this.Width, this.Height);*/
/*			mNet = new Net.Net(
				delegate (String s) { this.Text = s; return true; },
				new ControllerComp(win("Red player win!")),
				new ControllerPlayer(win("Blue player win!")),
				9, 3, 3, this.Width, this.Height);*/
		}

		public void OnSelectGameMode(int count, int lineCount, int blueCount, int redCount, bool firstComp, bool secondComp)
		{
			Wait = firstComp && secondComp;
			mNet = new Net.Net(
				delegate (String s) { return true; },
				(firstComp ? (Controller)new ControllerComp(win("Blue player win!")) : new ControllerPlayer(win("Blue player win!"))),
				(secondComp ? (Controller)new ControllerComp(win("Red player win!")) : new ControllerPlayer(win("Red player win!"))),
				count, lineCount, blueCount, redCount, this.Width, this.Height);
		}

		Del.None win(String msg)
		{
			return delegate ()
			{
				MessageBox.Show(msg);
				newGame();
			};
		}

		private void Form1_Paint(object sender, PaintEventArgs e)
		{
			if (mNet != null)
			{
				mNet.getCurPlayerController().paint(new Drawer(e.Graphics, this.Width - 15, this.Height - 35));
				if (Wait)
					e.Graphics.DrawString("(press 'Space' to unpause)", this.Font, new SolidBrush(Color.Black), new RectangleF(20, 20, 300, 300));
			}
		}

		private void Form1_MouseMove(object sender, MouseEventArgs e)
		{
			if (mNet != null)
			{
				mNet.getCurPlayerController().mouseMove(e);
				Invalidate();
			}
		}

		private void Form1_MouseDown(object sender, MouseEventArgs e)
		{
			if (mNet != null)
			{
				mNet.getCurPlayerController().mouseDown(e);
				Invalidate();
			}
		}

		private void Form1_MouseUp(object sender, MouseEventArgs e)
		{
			if (mNet != null)
			{
				mNet.getCurPlayerController().mouseUp(e);
				Invalidate();
			}
		}

		private void mTimer_Tick(object sender, EventArgs e)
		{
			if (mNet != null && Wait == false)
			{
				mNet.getCurPlayerController().inc(0.1f);
				Invalidate();
			}
		}

		private void Form1_KeyDown(object sender, KeyEventArgs e)
		{
		}

		private void Form1_KeyPress(object sender, KeyPressEventArgs e)
		{
			if (e.KeyChar == ' ')
			{
				Wait = !Wait;
			}
		}
	}
}
