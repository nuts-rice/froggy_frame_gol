export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: 1200,
        width: 1200,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#917289",
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}
