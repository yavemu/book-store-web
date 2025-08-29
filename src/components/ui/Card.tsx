interface CardProps {
  children: React.ReactNode;
  title?: string;
}

export default function Card({ children, title }: CardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      {title && (
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#333'
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}