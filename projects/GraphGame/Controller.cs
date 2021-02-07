using System.Windows.Forms;

namespace Net
{
	public interface Controller
	{
		void init(Player player);
		void paint(Drawer drawer);
		void mouseMove(MouseEventArgs e);
		void mouseDown(MouseEventArgs e);
		void mouseUp(MouseEventArgs e);
		void win();
		void inc(double inc);
		void onBeginTurn();
		void onEndTurn();
	}
}
