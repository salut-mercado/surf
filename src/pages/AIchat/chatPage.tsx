import { useState } from "react";
import DraggableWindow from "./draggableWindow";
import FloatingButton from "~/components/ui/floatingActionButton";
import ChatWindow from "./ChatWindow";

export function Chat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingButton onClick={() => setOpen(true)} />
      <DraggableWindow open={open} onClose={() => setOpen(false)}>
        <ChatWindow />
      </DraggableWindow>
    </>
  );
}