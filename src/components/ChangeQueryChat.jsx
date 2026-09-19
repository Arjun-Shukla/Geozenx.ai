import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, CornerDownLeft } from 'lucide-react';
import { askChangeQuestion } from '../api';

const SUGGESTIONS = [
  "What changed the most?",
  "Where did vegetation decrease?",
  "How much urban expansion occurred?",
  "Summarize the detected changes"
];

export default function ChangeQueryChat({ analysisData }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'GeoZenX Change Intelligence active. Select a suggested query or type a natural language question to analyze the multi-spectral temporal results.',
      badge: 'SYSTEM READY',
      timestamp: '02:56 AM'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    askChangeQuestion({ query: text, analysis: analysisData })
      .then((response) => {
        setMessages((prev) => [...prev, { ...response, id: (Date.now() + 1).toString() }]);
      })
      .catch((error) => {
        setMessages((prev) => [...prev, {
          text: `Backend chat request failed: ${error.message}`,
          badge: 'API ERROR',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          id: (Date.now() + 1).toString()
        }]);
      })
      .finally(() => setIsTyping(false));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-space-900/90 rounded-xl border border-space-700/80 p-6 shadow-2xl hud-box relative overflow-hidden">
        
        {/* Section Header */}
        <div className="border-b border-space-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
              CHANGE INTELLIGENCE
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Query the detected changes using natural language.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="mb-4">
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>QUICK ANALYSIS PROMPTS:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-space-950/80 border border-space-750 hover:border-cyan-500/50 hover:bg-space-850 text-slate-300 hover:text-cyan-300 transition text-left active:scale-[0.98]"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-space-950/80 rounded-lg border border-space-800 p-4 h-[320px] overflow-y-auto mb-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 border ${
                  isUser 
                    ? 'bg-blue-600/30 border-blue-500/40 text-blue-300' 
                    : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-2xl rounded-lg p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-950/40 border border-blue-500/30 text-slate-100 font-sans'
                    : 'bg-space-900 border border-space-750 text-slate-200 font-sans'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-1 border-b border-space-800/80 pb-1 font-mono text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">{isUser ? 'USER QUERY' : 'GEOZENX AI'}</span>
                    <div className="flex items-center space-x-2">
                      {msg.badge && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[9px]">
                          {msg.badge}
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs p-2">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Synthesizing remote sensing telemetry...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about the detected changes..."
            className="flex-1 px-4 py-3 rounded-lg bg-space-950 border border-space-750 focus:border-cyan-500 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className={`px-5 py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition ${
              inputQuery.trim()
                ? 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-md shadow-cyan-500/20 active:scale-95'
                : 'bg-space-850 text-slate-600 border border-space-800 cursor-not-allowed'
            }`}
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </section>
  );
}
