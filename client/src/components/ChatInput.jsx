import { Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ChatInput({ onSend, loading = false, placeholder = "Type your message...", value, onChange }) {
  const [internalMessage, setInternalMessage] = useState('');

  // Use external value if provided, otherwise internal state
  const message = value !== undefined ? value : internalMessage;
  const setMessage = onChange || setInternalMessage;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="btn-primary flex items-center gap-2"
      >
        <Send size={20} />
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
}
