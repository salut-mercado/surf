import { useState } from "react";
import DraggableWindow from "./draggableWindow";
import FloatingButton from "~/components/ui/floatingActionButton";
import ChatWindow, { type Message } from "./ChatWindow";



export function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "System", text: "Привет! Я AI-бот. Задай мне вопрос." }]);

  return (
    <>
      <FloatingButton onClick={() => setOpen(true)} />
      <DraggableWindow open={open} onClose={() => setOpen(false)}>
        <ChatWindow
        messages={messages}
        setMessages={setMessages} />
      </DraggableWindow>
    </>
  );
}