/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;*/
using System.Drawing;


namespace Net
{
	public struct Drawer
	{
		Graphics mGraphics;
		int mWidth;
		int mHeight;

		public Drawer(Graphics g, int width, int height)
		{
			mGraphics = g;
			mWidth = width;
			mHeight = height;
		}

		public void drawLine(Pen pen, Vec pos1, Vec pos2)
		{
			mGraphics.DrawLine(pen, pos1.point(), pos2.point());
		}
			
		public void drawEllipse(Pen pen, Vec pos, int size)
		{
			mGraphics.DrawEllipse(pen, (int)(pos.mX - size / 2), (int)(pos.mY - size / 2), size, size);
		}

		public void fillScreen(Brush brush, Pen pen)
		{
			mGraphics.FillRectangle(brush, 0, 0, mWidth, mHeight);
			mGraphics.DrawRectangle(pen, 0, 0, mWidth, mHeight);
		}

		public void drawExplose(Pen pen, Vec pos, double size, double proc)
		{
			const int DIR = 24;
			for (int i = 0; i < DIR; i++)
			{
				Vec dir = Vec.getDir(i, DIR, size);
				Vec p1 = dir * (0.8f + proc * 2);
				Vec p2 = dir * (1.2f + proc * 2);
				drawLine(pen, pos + p1, pos + p2);
			}
		}

	}
}
