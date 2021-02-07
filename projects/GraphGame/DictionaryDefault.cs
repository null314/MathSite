using System.Collections.Generic;

namespace Net
{
	public class DictionaryDefault<Key, Value> : Dictionary<Key, Value>
	{
		public delegate Value Modifier(Value x);

		Value mDefault;
	
		public DictionaryDefault(Value def)
		{
			mDefault = def;
		}
		public Value get(Key key)
		{
			if(ContainsKey(key))
				return this[key];
			else
				return mDefault;
		}
		protected void set(Key key, Value value)
		{
			this[key] = value;
		}
		protected void apply(Key key, Modifier modifier)
		{
			Value value = get(key);
			set(key, modifier(value));
		}
	}
}
