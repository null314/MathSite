using System;
using System.Drawing;

namespace Net
{
	public struct Vec : IInterpolatable<Vec>
	{
		public double mX;
		public double mY;

		public Vec(double x, double y)
		{
			mX = x;
			mY = y;
		}

		public Vec(Point point)
		{
			mX = point.X;
			mY = point.Y;
		}

		static public Vec getDir(int angle, int part, double len)
		{
			return new Vec(Math.Cos(Math.PI * 2 * angle / part) * len, Math.Sin(Math.PI * 2 * angle / part) * len);
		}

		public Point point()
		{
			return new Point((int)mX, (int)mY);
		}

		public double lenght()
		{
			return Math.Sqrt(mX * mX + mY * mY);
		}
		public Vec norm()
		{
			double len = lenght();
			if (len > 0.001)
				return this / len;
			else
				return new Vec(1, 0);
		}
		public Vec rotate()
		{
			return new Vec(mY, -mX);
		}

		static public Vec operator -(Vec vec1, Vec vec2)
		{
			return new Vec(vec1.mX - vec2.mX, vec1.mY - vec2.mY);
		}
		static public Vec operator +(Vec vec1, Vec vec2)
		{
			return new Vec(vec1.mX + vec2.mX, vec1.mY + vec2.mY);
		}
		static public Vec operator /(Vec vec1, double a)
		{
			return new Vec(vec1.mX / a, vec1.mY / a);
		}
		static public Vec operator *(Vec vec1, double a)
		{
			return new Vec(vec1.mX * a, vec1.mY * a);
		}


		public Vec interpolate(Vec vec, double x)
		{
			return this * (1 - x) + vec * x;
		}


		public bool isInside(Vec pos, int size)
		{
			return
				pos.mX > mX - size / 2 &&
				pos.mX < mX + size / 2 &&
				pos.mY > mY - size / 2 &&
				pos.mY < mY + size / 2;
		}
	}
}
