import LoginForm from '@/src/components/login'; 
// (Asegúrate de que la ruta de importación coincida con tu estructura de carpetas)

export default function LoginPage() {
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
        {/* Aquí es donde incrustamos a nuestro trabajador */}
        <LoginForm />
      </div>
    </main>
  );
}