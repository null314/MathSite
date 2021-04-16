using System;

public struct Complex
{
	public readonly double Re;
	public readonly double Im;

	public Complex(double re, double im)
	{
		Re = re;
		Im = im;
	}

	public string Print()
	{
		return Re.ToString() + " + i*" + Im.ToString();
	}

	public Complex Sum(Complex c)
	{
		return new Complex(Re + c.Re, Im + c.Im);
	}

	public Complex Minus(Complex c)
	{
		return new Complex(Re - c.Re, Im - c.Im);
	}

	public Complex Mult(Complex c)
	{
		return new Complex(Re * c.Re - Im * c.Im, Re * c.Im + Im * c.Re);
	}

	public Complex Div(Complex c)
	{
		return new Complex(Re * c.Re + Im * c.Im, -Re * c.Im + Im * c.Re).Mult(new Complex(1 / c.SqrMagnitude(), 0));
	}

	public double SqrMagnitude()
	{
		return Re * Re + Im * Im;
	}

	public double Magnitude()
	{
		return Math.Sqrt(Re * Re + Im * Im);
	}
}
