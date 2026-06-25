import { useState, useRef, useEffect } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Send, Mic, MicOff, Volume2, VolumeX, Trash2, MessageSquare, Loader2, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/agrivet/DashboardLayout";
import { apiClient } from "@/lib/api-client";
import { useLanguageStore } from "@/store/languageStore";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  _id: string;
  messages: Message[];
  language: string;
  createdAt: string;
}

const suggestedQuestions = {
  en: [
    "What crops should I plant this season?",
    "How to treat cattle fever?",
    "List dairy schemes in Tamil Nadu",
    "How to prevent rice blast disease?",
    "Best fertilizer for tomato crop?",
  ],
  ta: [
    "இந்த பருவத்தில் என்ன பயிர் விளைவிக்கலாம்?",
    "மாட்டு காய்ச்சலை எப்படி சிகிச்சை செய்வது?",
    "தமிழ்நாட்டில் பால் பண்ணை திட்டங்கள் என்ன?",
    "நெல் வெடிப்பு நோயை எப்படி தடுப்பது?",
    "தக்காளி பயிருக்கு சிறந்த உரம் எது?",
  ],
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguageStore();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiClient.get("/api/chat/history");
      setSessions(data);
    } catch {}
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await apiClient.post("/api/chat/message", { message: text, language, sessionId });
      const aiMsg: Message = { role: "model", content: data.response, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      if (!sessionId) setSessionId(data.sessionId);

      if (voiceEnabled && data.response) {
        const utterance = new SpeechSynthesisUtterance(data.response.replace(/[*#]/g, ""));
        utterance.lang = language === "ta" ? "ta-IN" : "en-IN";
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser");
      return;
    }
    const SpeechRecognition = (window as Window & typeof globalThis & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as Window & typeof globalThis & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearChat = async () => {
    setMessages([]);
    setSessionId(null);
    try { await apiClient.delete("/api/chat/history"); } catch {}
    fetchHistory();
  };

  const loadSession = async (session: ChatSession) => {
    setMessages(session.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })));
    setSessionId(session._id);
    setShowHistory(false);
  };

  return (
    <DashboardLayout>
      <Helmet><title>AI Chat — AgriVet AI</title></Helmet>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 font-semibold text-sm text-gray-700">Chat History</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sessions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No previous chats</p>
              ) : (
                sessions.map((s) => (
                  <button key={s._id} onClick={() => loadSession(s)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-xs text-gray-600">
                    <p className="font-medium truncate">{s.messages[0]?.content?.slice(0, 40) || "Chat session"}</p>
                    <p className="text-gray-400 mt-0.5">{new Date(s.createdAt).toLocaleDateString()}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Chat */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm font-heading">AgriVet AI Assistant</h1>
                <p className="text-xs text-gray-500">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLanguage(language === "en" ? "ta" : "en")}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                {language === "en" ? "தமிழ்" : "English"}
              </button>
              <button onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg border ${voiceEnabled ? "bg-green-100 border-green-200 text-green-700" : "border-gray-200 text-gray-400"}`}
                title="Toggle voice output">
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button onClick={() => setShowHistory(!showHistory)} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button onClick={() => { setMessages([]); setSessionId(null); }} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50" title="New chat">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={clearChat} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500" title="Clear history">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 font-heading">
                  {language === "ta" ? "AgriVet AI உதவியாளர்" : "AgriVet AI Assistant"}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {language === "ta" ? "விவசாயம், கால்நடை, அரசு திட்டங்கள் பற்றி கேளுங்கள்" : "Ask about crops, livestock, government schemes, weather & more"}
                </p>
                <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                  {suggestedQuestions[language].map((q) => (
                    <button key={q} onClick={() => sendMessage(q)}
                      className="text-left px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800 hover:bg-green-100 transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "model" && (
                  <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-green-700 text-white rounded-tr-sm"
                    : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`}>
                  {msg.role === "model" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-green-200" : "text-gray-400"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <button onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-2.5 rounded-xl border transition-colors flex-shrink-0 ${isListening ? "bg-red-100 border-red-200 text-red-600 animate-pulse" : "border-gray-200 text-gray-400 hover:bg-gray-50"}`}>
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder={language === "ta" ? "உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்..." : "Ask about farming, livestock, schemes..."}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={loading}
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                className="p-2.5 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50 flex-shrink-0">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
