class Complex
{
	Re: number;
	Im: number;
	
	constructor(re: number, im: number)
	{
		this.Re = re;
		this.Im = im;	
	}
	

	Plus(c: Complex): Complex
	{
		return new Complex(this.Re + c.Re,  this.Im + c.Im);
	}

	Minus(c: Complex): Complex
	{
		return new Complex(this.Re - c.Re,  this.Im - c.Im);
	}

	Mult(c: Complex): Complex
	{
		return new Complex(this.Re*c.Re - this.Im*c.Im, this.Re*c.Im + this.Im*c.Re);
	}

	MultNumber(c: number): Complex
	{
		return new Complex(this.Re*c, this.Im*c);
	}

	Magnitude(): number
	{
		return Math.sqrt(this.MagnitudeSqr());
	}
	
	MagnitudeSqr(): number
	{
		return this.Re*this.Re + this.Im*this.Im;
	}

	Div(c: Complex): Complex
	{
		var magnitudeSqr = c.MagnitudeSqr();
		return new Complex((this.Re*c.Re + this.Im*c.Im) / magnitudeSqr, (this.Im*c.Re - this.Re*c.Im) / magnitudeSqr);
	}

	Conjugate(): Complex
	{
		return new Complex(this.Re, -this.Im);
	}
	
	Norm(): Complex
	{
		var magnitude = this.Magnitude();
		return new Complex(this.Re / magnitude, this.Im / magnitude);	
	}
	
	Argument(): number
	{
		if(this.Im > 0)
			return Math.acos(this.Re / this.Magnitude());
		else
			return -Math.acos(this.Re / this.Magnitude());
	}
	
}