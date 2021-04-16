using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MainMono : MonoBehaviour
{
	Prog Prog;

	void Start ()
	{
		Prog = new Prog();
	}

	/*	void Update ()
		{

		}*/

	private void OnGUI()
	{
		Prog.OnGui();
	}
}
