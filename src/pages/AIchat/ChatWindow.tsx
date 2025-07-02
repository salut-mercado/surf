import { useState, useRef, useEffect } from "react";



// const initialMessages = [
//   { role: "system", text: "Привет! Я AI-бот. Задай мне вопрос." }
// ];
export interface Message {
  role : "System" | "User" | "Bot",
  text : string
}
interface ChatWindowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatWindow({messages, setMessages} : ChatWindowProps) {
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { role: "User", text }
    ]);
    setInput("");
    setIsBotTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "Bot", text: `Вы сказали: ${text}` }
      ]);
      setIsBotTyping(false);
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        marginBottom: 8,
        borderBottom: '1px solid #eee',
        paddingBottom: 8
      }}>
        AI Chat
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f7f9fa',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        {messages.filter(m => m.role !== 'System').length === 0 && (
          <div style={{ color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 }}>
            Нет сообщений
          </div>
        )}
        {messages.map((msg, idx) => (
          msg.role === 'System' ? (
            <div key={idx} style={{ color: '#888', fontSize: 14, textAlign: 'center', margin: '8px 0' }}>{msg.text}</div>
          ) : (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'User' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  background: msg.role === 'User'
                    ? 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
                    : '#e5e7eb',
                  color: msg.role === 'User' ? '#fff' : '#222',
                  borderRadius: 16,
                  padding: '8px 14px',
                  maxWidth: '70%',
                  fontSize: 15,
                  margin: msg.role === 'User' ? '2px 0 2px 40px' : '2px 40px 2px 0',
                  boxShadow: msg.role === 'User'
                    ? '0 2px 8px rgba(106,17,203,0.08)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
            </div>
          )
        ))}
        {isBotTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: '#e5e7eb',
              color: '#222',
              borderRadius: 16,
              padding: '8px 14px',
              maxWidth: '70%',
              fontSize: 15,
              margin: '2px 40px 2px 0',
              opacity: 0.7
            }}>
              ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, borderRadius: 16, border: '1px solid #ccc', padding: 10, fontSize: 15 }}
          disabled={isBotTyping}
        />
        <button
          onClick={handleSend}
          disabled={isBotTyping || !input.trim()}
          style={{
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '10px 20px',
            fontWeight: 600,
            cursor: isBotTyping || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: 15,
            opacity: isBotTyping || !input.trim() ? 0.7 : 1
          }}
        >Отправить</button>
      </div>
    </div>
  );
} 