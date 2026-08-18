import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, Loader2, User, HelpCircle } from 'lucide-react';
import { api } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Campus Assistant. Ask me about your attendance, upcoming assignments, eligible placements, or events!',
    },
  ]);

  const quickPrompts = [
    'How much attendance do I have?',
    'When is my next assignment due?',
    'What events are happening this week?',
    'Which placements am I eligible for?',
  ];

  const handleSend = async (promptText?: string) => {
    const queryText = promptText || input;
    if (!queryText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    if (!promptText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', { query: queryText });
      const botResponse = res.data.data.answer || 'I am currently unable to fetch data for that query.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I encountered an error connecting to campus services.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 sm:w-96 h-[480px] bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-none flex items-center gap-1.5">
                    Campus AI Assistant <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </h4>
                  <span className="text-[10px] text-white/80">RBAC Data Context Enabled</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-dark-hover text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 items-center text-gray-400 text-xs pl-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" /> Thinking...
                </div>
              )}
            </div>

            <div className="p-2 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50">
              <div className="flex gap-1 overflow-x-auto pb-2 mb-1 no-scrollbar">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp)}
                    className="whitespace-nowrap px-2.5 py-1 text-[10px] bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full text-gray-600 dark:text-gray-300 hover:border-brand-500 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3 text-brand-500" /> {qp}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl px-3 py-1.5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your AI campus assistant..."
                  className="w-full text-xs bg-transparent outline-none text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="p-1 text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 rounded-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-full shadow-lg shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all font-semibold text-xs"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">AI Assistant</span>
      </button>
    </div>
  );
};
