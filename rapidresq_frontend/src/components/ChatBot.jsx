import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const QA_PAIRS = {
  "hello": "Hello! I am the RapidResQ AI Assistant. How can I help you with disaster information, first aid, or emergency contacts?",
  "hi": "Hello! I am the RapidResQ AI Assistant. How can I help you?",
  "help": "I can provide information on first aid, emergency contacts, or help you navigate. Try asking 'What's the emergency number?' or 'First aid for burns'.",
  "emergency": "For immediate national emergencies, dial 112. For disaster management, the NDRF control room is 1078. Ambulance is 108.",
  "number": "National Emergency: 112. Ambulance: 108. NDRF: 1078.",
  "flood": "In case of floods: Avoid walking or driving through flood waters. Do not touch electrical equipment if you are wet. Seek higher ground.",
  "fire": "In case of fire: Get out quickly, stay low to the ground to avoid smoke. Call 112 or local fire services immediately.",
  "burn": "For burns: Cool the burn under cool running water for at least 10 minutes. Do NOT apply ice or butter. Cover loosely.",
  "cpr": "CPR: Push hard and fast in the center of the chest (100-120 pushes a minute) if the person is unresponsive and not breathing.",
  "contact": "Check the 'Contacts & SOS' page in the sidebar for a full list of emergency personnel, or dial 112 for immediate assistance."
};

const getBotResponse = (input) => {
  const lowerInput = input.toLowerCase();
  for (const [key, value] of Object.entries(QA_PAIRS)) {
    if (lowerInput.includes(key)) {
      return value;
    }
  }
  return "I'm sorry, I don't have specific information on that. Please check the 'First Aid Hub' or 'Contacts & SOS' pages for detailed guides, or dial 112 in a true emergency.";
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your RapidResQ AI Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { text: input.trim(), isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMsg.text);
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 sm:w-96 mb-4 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold tracking-wide">RapidResQ AI</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                {msg.isBot && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 flex-shrink-0"><Bot className="w-4 h-4 text-slate-700" /></div>}
                <div 
                  className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.isBot 
                      ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm' 
                      : 'bg-blue-600 text-white rounded-tr-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about emergencies or first aid..." 
                className="w-full bg-gray-100 text-gray-800 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
        >
          <MessageSquare className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
