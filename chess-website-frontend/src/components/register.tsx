"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function RegistroFrom() {
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      const respuesta = await fetch('http://localhost:4000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Mandamos los 3 datos al backend
        body: JSON.stringify({ username, email, password }) 
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje('¡Cuenta creada con éxito! Redirigiendo al login...');
        // Si sale bien, lo mandamos a la pantalla de login después de 2 segundos
        setTimeout(() => router.push('/login'), 2000); 
      } else {
        setMensaje(`⚠️ ${data.message}`);
      }
    } catch (error) {
      setMensaje('❌ Error: No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Crear Cuenta Nueva</h2>
      
      <form onSubmit={manejarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Nuevo campo para el correo */}
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{ padding: '8px' }}
        />

        <input 
          type="text" 
          placeholder="Nombre de usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required
          style={{ padding: '8px' }}
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          style={{ padding: '8px' }}
        />
        
        <button 
          type="submit" 
          disabled={cargando || !username || !password || !email}
          style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {cargando ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      {/* Botón para regresar al login si el usuario ya tiene cuenta */}
      <button 
        onClick={() => router.push('/login')}
        style={{ marginTop: '15px', background: 'transparent', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
      >
        ¿Ya tienes cuenta? Inicia sesión aquí
      </button>

      {mensaje && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  );
}