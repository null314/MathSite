using UnityEngine;
using System.Linq;
using System;

public class Prog
{
	double[, ] M;
	double[, ] MR;

	int Step = 10;

	double R1;
	double R2;
	double R3;
	double R4;

	public Prog()
	{
		var a0 = 0.90f;
		var a01 = 1 - a0;
//		var a1 = 0.8f;

		M = new double[2, 2];
		M[0, 0] = a0;
		M[0, 1] = a01;
		M[1, 0] = a01;
		M[1, 1] = a0;

		MR = Pow(M, Step);

		R1 = Math.Pow(a0, Step);
		R2 = Math.Pow(a0, Step-2)* Math.Pow(a01, 2)*Comb(2, Step);
		R3 = Math.Pow(a0, Step-4)* Math.Pow(a01, 4)*Comb(4, Step);
		R4 = Math.Pow(a0, Step-6)* Math.Pow(a01, 6)*Comb(6, Step);

	}


	public void OnGui()
	{
		GUILayout.Label("Hello");

		Print(M);
		Print(MR);

		GUILayout.Label(R1.ToString());
		GUILayout.Label(R2.ToString());
		GUILayout.Label((R1 + R2).ToString());
		GUILayout.Label(R3.ToString());
		GUILayout.Label((R1 + R2 + R3).ToString());
		GUILayout.Label(R4.ToString());
		GUILayout.Label((R1 + R2 + R3 + R4).ToString());

		var c1 = new Complex(1, 2);
		var c2 = new Complex(3, 5);
		var m = c1.Mult(c2);
		var m2 = m.Div(c2);

		GUILayout.Label(m.Print());
		GUILayout.Label(m2.Print());
	}


	public static double[,] Mult(double[,] m1, double[,] m2)
	{
		var size = m1.GetLength(0);
		var result = new double[size, size];

		foreach (var i in size.Traverse())
			foreach (var o in size.Traverse())
				result[i, o] = size.Traverse().Sum(p => m1[i, p] * m2[p, o]);

		return result;
	}

	public static double[,] Pow(double[,] m1, int pow)
	{
		var size = m1.GetLength(0);
		var result = new double[size, size];
		foreach (var i in size.Traverse())
			foreach (var o in size.Traverse())
				result[i, o] = i == o ? 1 : 0;

		foreach (var o in pow.Traverse())
		{
			result = Mult(result, m1);
		}
		return result;
	}

	public static void Print(double[,] m1)
	{
		var size = m1.GetLength(0);
		foreach (var i in size.Traverse())
			foreach (var o in size.Traverse())
				GUILayout.Label(string.Format("m[{0}, {1}] = {2}", i, o, m1[i, o]));
	}

	public static int Comb(int count, int of)
	{
		return Enumerable.Range(1 + of - count, count).Aggregate((i, o) => i * o) / Enumerable.Range(1, count).Aggregate((i, o) => i * o);
	}
}
