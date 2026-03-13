import RegistroForm from '@/src/components/register'; 

export default function RegistroPage() {
  return (
    <main style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f4f4f4' 
    }}>
      <div style={{ 
        padding: '40px', 
        background: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <RegistroForm />
      </div>
    </main>
  );
}