export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: 1005,
        width: 1005,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#917289',
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}
