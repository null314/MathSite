using System;
using UnityEngine;

public class MainMono : MonoBehaviour
{
	private Prog Prog;


	void Start ()
	{
		try
		{
			Prog = new Prog();
		}
		catch (Exception e)
		{
			Debug.LogError(e);
		}
	}
	
	void Update ()
	{
		
	}

	private void OnGUI()
	{
		try
		{
			Prog.OnGui();
		}
		catch (Exception e)
		{
		}

	}
}
