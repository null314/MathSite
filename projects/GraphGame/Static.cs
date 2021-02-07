using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Net
{
	public static class Static
	{

		public abstract class Move : Del.IMaybe
		{
			bool mNothing;

			public Move(bool nothing)
			{
				mNothing = nothing;
			}

			public bool isNothing()
			{
				return mNothing;
			}

			public abstract bool apply();
		}

		public class MoveNothing : Move
		{
			public MoveNothing()
				: base(true)
			{
			}
			public override bool apply()
			{
				return false;
			}
		}
		public class MoveClickLine : Move
		{
			Line mLine;
			String mLog;
			Player mPlayer;

			public MoveClickLine(Player player, Line line, String log)
				: base(false)
			{
				mPlayer = player;
				mLine = line;
				mLog = log;
			}
			public override bool apply()
			{
				mPlayer.log(mLog);
				return mPlayer.clickLine(mLine);
			}
		}
		public class MoveDragFishkaToNode : Move
		{
			Fishka mFishka;
			Node mNode;
			String mLog;
			Player mPlayer;

			public MoveDragFishkaToNode(Player player, Fishka fishka, Node node, String log)
				: base(false)
			{
				mPlayer = player;
				mFishka = fishka;
				mNode = node;
				mLog = log;
			}
			public override bool apply()
			{
				mPlayer.log(mLog);
				return mPlayer.dragFishkaToNode(mFishka, mNode);
			}
		}

		public class MoveClickNode : Move
		{
			Node mNode;
			String mLog;
			Player mPlayer;

			public MoveClickNode(Player player, Node node, String log)
				: base(false)
			{
				mPlayer = player;
				mNode = node;
				mLog = log;
			}
			public override bool apply()
			{
				mPlayer.log(mLog);
				return mPlayer.clickNode(mNode);
			}
		}


		public static Cont<Move, Move> with<A>(this ListAccessor<A> list, Func<A, Cont<Move, Move>> amb)
		{
			return list.toContBind(new MoveNothing(), amb);
		}


	}
}
