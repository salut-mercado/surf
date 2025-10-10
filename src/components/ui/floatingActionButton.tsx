interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => (
  <button
    onClick={onClick}
    style={{
      position: "fixed",
      bottom: 40,
      right: 40,
      width: 70,
      height: 70,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 16px rgba(40,60,120,0.25)",
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: "1px",
      cursor: "pointer",
      zIndex: 1001,
      transition: "transform 0.15s, box-shadow 0.15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
    }}
    onMouseOver={(e) => {
      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
      (e.currentTarget as HTMLButtonElement).style.boxShadow =
        "0 8px 24px rgba(40,60,120,0.35)";
    }}
    onMouseOut={(e) => {
      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      (e.currentTarget as HTMLButtonElement).style.boxShadow =
        "0 4px 16px rgba(40,60,120,0.25)";
    }}
  >
    salutAI
  </button>
);

export default FloatingButton;
