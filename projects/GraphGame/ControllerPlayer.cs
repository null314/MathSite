/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;*/
using System.Windows.Forms;

namespace Net
{
	class ControllerPlayer : Controller
	{
		Mouse mMouse;
		Node mSelectedNode;
		Fishka mSelectedFishka;
		Player mPlayer;
		Line mSelectedLine;
		Del.None mWin;

		public void inc(double inc)
		{
			mPlayer.incForController(inc);
		}

		public ControllerPlayer(Del.None win)
		{
			mWin = win;
			mMouse = new Mouse(null, onDragLeft, onClickRight, null);
		}

		public void win()
		{
			mWin();
		}
		public void onBeginTurn()
		{
		}
		public void onEndTurn()
		{
			mMouse.detach();
		}

		public void init(Player player)
		{
			mPlayer = player;
		}

		public void paint(Drawer drawer)
		{
			mPlayer.paintForController(drawer, mMouse.mPos, out mSelectedNode, out mSelectedFishka, out mSelectedLine);
		}

		public void mouseMove(MouseEventArgs e)
		{
			mMouse.move(e);
		}
		public void mouseDown(MouseEventArgs e)
		{
			mMouse.down(e);
		}
		public void mouseUp(MouseEventArgs e)
		{
			mMouse.up(e);
		}

		void onClickRight(Vec pos)
		{
			if (mSelectedNode != null)
				mPlayer.clickNode(mSelectedNode);
			else
				if (mSelectedLine != null)
					mPlayer.clickLine(mSelectedLine);
		}

		DragRezult onDragLeft(Vec pos)
		{
			if (mSelectedNode != null)
				return dragNode(pos);
			else
				if (mSelectedFishka != null)
					return dragFishka(pos);
				else
					return null;
		}

		DragRezult dragFishka(Vec pos)
		{
			return mPlayer.getFishkaDragger(mSelectedFishka, pos);
		}

		DragRezult dragNode(Vec pos)
		{
			return mSelectedNode.getDragger(pos);
		}


	}
}
