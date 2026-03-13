"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  
  // Estados para guardar lo que escribe el usuario y mostrar mensajes
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Esta función maneja tanto el Login como el Registro dependiendo de qué botón presiones
  const enviarFormulario = async (e: React.FormEvent, tipo: 'login' | 'registro') => {
    e.preventDefault(); // Evita que la página se recargue
    setMensaje('');
    setCargando(true);

    try {
      // Apuntamos a tu backend en el puerto 4000
      const url = `http://localhost:4000/api/${tipo}`;
      
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        if (tipo === 'login') {
          // Si es login exitoso, guardamos las credenciales y redirigimos
          localStorage.setItem('ajedrez_token', data.token);
          localStorage.setItem('ajedrez_username', data.username);
          setMensaje('¡Conectado exitosamente! Entrando al juego...');
          
          // Te manda de regreso al menú principal después de 1 segundo
          setTimeout(() => router.push('/'), 1000); 
        } else {
          // Si es registro exitoso, solo avisamos
          setMensaje('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        }
      } else {
        // Si la contraseña es incorrecta o el usuario ya existe, mostramos el error
        setMensaje(` ${data.message}`);
      }
    } catch (error) {
      setMensaje(' Error: No se pudo conectar con el servidor Express.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Bienvenido al Ajedrez</h2>
      
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
        
        {/* Botón principal para iniciar sesión */}
        <button 
          onClick={(e) => enviarFormulario(e, 'login')} 
          disabled={cargando || !username || !password}
          style={{ padding: '10px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {cargando ? 'Cargando...' : 'Iniciar Sesión'}
        </button>

        {/* Botón secundario para registrarse */}
        <button 
            type="button" /* ¡ESTA ES LA MAGIA! Evita que recargue la página */
            onClick={() => router.push('/register')} /* Asegúrate de que el nombre coincida con tu carpeta (register o registro) */
            style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
            >
            Crear cuenta nueva
        </button>
      </form>

      {/* Aquí mostramos los mensajes de error o éxito */}
      {mensaje && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  );
}