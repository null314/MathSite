using System;
using UnityEngine;
using ProgLib;
using InterfacesLib;

namespace TerminalLib
{
	public class MainMono : MonoBehaviour
	{
		private IProg Prog;


		void Start()
		{
			try
			{
				Prog = new Prog();
//				Prog.LoadFile("prog.txt");
			}
			catch (Exception e)
			{
				Debug.LogError(e);
			}
		}

		void Update()
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
}