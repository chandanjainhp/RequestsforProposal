import React, { useState, useEffect } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';

const ChatPage = () => {
  // --- State Management ---
  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'Cloud Infrastructure Migration',
      time: '2m ago',
      messages: [
        { id: 1, role: 'ai', content: "Hello! I'm BidSense AI. How can I assist you with your procurement tasks today?", time: '10:00 AM' },
        { id: 2, role: 'user', content: "Can you analyze the 'Cloud Infrastructure Migration' RFP?", time: '10:02 AM' },
        { id: 3, role: 'ai', content: "I've reviewed the security section. It's missing specific clauses regarding 'Zero Trust Architecture'.", time: '10:02 AM' }
      ]
    },
    {
      id: 2,
      title: 'Vendor Comparison – IT Services',
      time: '1h ago',
      messages: [
        { id: 1, role: 'ai', content: "I've compared the top 3 vendors. TechFlow offers the best value.", time: '09:15 AM' }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  // Derived state: Current active chat
  const activeChat = chats.find(c => c.id === activeChatId) || { messages: [] };

  // --- Actions ---

  const handleNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: 'New Conversation',
      time: 'Just now',
      messages: [
        {
          id: 1,
          role: 'ai',
          content: "Hello! I'm BidSense AI. I can help you draft RFPs, analyze vendor proposals, or identify risks. How can I assist you today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setChats([newChat, ...chats]);
    setActiveChatId(newChatId);

    // Auto-close sidebar on mobile when starting new chat
    if (window.innerWidth < 768) {
      setIsHistoryOpen(false);
    }
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // Prevent triggering selection
    const updatedChats = chats.filter(c => c.id !== chatId);
    setChats(updatedChats);

    // If we deleted the active chat, switch to the first available one or create new
    if (chatId === activeChatId) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id);
      } else {
        // No chats left, create a fresh one is a bit complex in render, so just set active to null or handle empty state
        // For simplicity, let's just trigger new chat if empty
        // handleNewChat() won't work directly here due to closure staleness if not careful, but setChats is state update.
        // Let's simplified: If empty, we render empty state or trigger new chat effect. 
        // We'll leave it empty for now and let the UI handle "No Chat Selected" or just auto-create in useEffect if needed.
        setActiveChatId(null);
      }
    }
  };

  // If no active chat (e.g. all deleted), create one automatically
  useEffect(() => {
    if (chats.length === 0) {
      handleNewChat();
    }
  }, [chats.length]);


  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages for the active chat
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        // If it's the first user message, update title
        const isFirstUserMessage = chat.messages.length === 1 && chat.messages[0].role === 'ai';
        const updatedTitle = isFirstUserMessage ? (text.slice(0, 30) + (text.length > 30 ? '...' : '')) : chat.title;

        return {
          ...chat,
          title: updatedTitle,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: "I've processed your request. This is a simulated response demonstrating the history persistence.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: [...chat.messages, aiResponse] };
        }
        return chat;
      }));
    }, 1000);
  };

  const handleClearContext = () => {
    // Clear messages of current chat but keep the chat item
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [
            {
              id: Date.now(),
              role: 'ai',
              content: "Context cleared. How can I help you next?",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return chat;
    }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-black font-sans overflow-hidden transition-colors duration-300">

      {/* --- Inner Sidebar: Chat History --- */}
      <ChatSidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* --- Main Chat Panel --- */}
      <main className="flex-1 flex flex-col relative bg-white dark:bg-black transition-colors duration-300">

        {/* Chat Toolbar */}
        <ChatHeader
          isSidebarOpen={isHistoryOpen}
          onToggleSidebar={() => setIsHistoryOpen(!isHistoryOpen)}
          title={activeChat.title || 'New Chat'}
          onClearContext={handleClearContext}
        />

        {/* Conversation Area */}
        <MessageList messages={activeChat.messages} />

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} />

      </main>
    </div>
  );
};

export default ChatPage;