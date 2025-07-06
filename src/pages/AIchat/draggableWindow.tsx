import type { ReactNode } from "react";
import { useRef, useState } from "react";

interface DraggableWindowProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

type ResizeDirection = 'right' | 'bottom' | 'corner' | null;

const DraggableWindow = ({ open, onClose, children }: DraggableWindowProps) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 390, y: window.innerHeight - 450 });
  const [size, setSize] = useState({ width: 350, height: 350 });
  const resizing = useRef<ResizeDirection>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  
  const onDragMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener('mousemove', onDragMouseMove);
    document.addEventListener('mouseup', onDragMouseUp);
  };

  const onDragMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onDragMouseUp = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', onDragMouseMove);
    document.removeEventListener('mouseup', onDragMouseUp);
  };

  
  const onResizeMouseDown = (dir: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation();
    resizing.current = dir;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
    document.addEventListener('mousemove', onResizeMouseMove);
    document.addEventListener('mouseup', onResizeMouseUp);
  };

  const onResizeMouseMove = (e: MouseEvent) => {
    if (!resizing.current) return;
    const start = resizeStart.current;
    let newWidth = start.width;
    let newHeight = start.height;
    if (resizing.current === 'right' || resizing.current === 'corner') {
      newWidth = Math.max(
        MIN_WIDTH,
        start.width + (e.clientX - start.x)
      );
    }
    if (resizing.current === 'bottom' || resizing.current === 'corner') {
      newHeight = Math.max(
        MIN_HEIGHT,
        start.height + (e.clientY - start.y)
      );
    }
    setSize({ width: newWidth, height: newHeight });
  };

  const onResizeMouseUp = () => {
    resizing.current = null;
    document.removeEventListener('mousemove', onResizeMouseMove);
    document.removeEventListener('mouseup', onResizeMouseUp);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 1000,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        padding: 20,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        width: size.width,
        height: size.height,
        resize: 'none',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: resizing.current ? 'none' : undefined,
        cursor: dragging.current ? 'move' : undefined,
      }}
    >
      
      <div
        onMouseDown={onDragMouseDown}
        style={{
          width: '100%',
          height: 32,
          cursor: 'move',
          position: 'absolute',
          left: 0,
          top: 0,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          background: 'rgba(0,0,0,0.02)',
          zIndex: 20,
        }}
      />
      <button onClick={onClose} style={{ position: "absolute", top: 8, right: 8, zIndex: 21 }}>×</button>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>{children}</div>
      
      <div
        onMouseDown={onResizeMouseDown('right')}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 10,
          height: '100%',
          cursor: 'ew-resize',
          zIndex: 1001,
          background: resizing.current === 'right' ? 'rgba(0,0,0,0.07)' : 'transparent',
        }}
      />
      
      <div
        onMouseDown={onResizeMouseDown('bottom')}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: 10,
          cursor: 'ns-resize',
          zIndex: 1001,
          background: resizing.current === 'bottom' ? 'rgba(0,0,0,0.07)' : 'transparent',
        }}
      />
      
      <div
        onMouseDown={onResizeMouseDown('corner')}
        style={{
          position: 'absolute',
          width: 18,
          height: 18,
          right: 0,
          bottom: 0,
          cursor: 'nwse-resize',
          zIndex: 1002,
          background: resizing.current === 'corner' ? 'rgba(0,0,0,0.10)' : 'transparent',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{
          width: 14,
          height: 14,
          borderRight: '2px solid #bbb',
          borderBottom: '2px solid #bbb',
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
};
export default DraggableWindow;