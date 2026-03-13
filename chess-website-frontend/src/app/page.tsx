"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  const [autorizado, setAutorizado] = useState(false);
  
  // 1. Convertimos 'room' en un estado de React (¡Mucho más seguro!)
  const [room, setRoom] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ajedrez_token');
  
    if (!token){
      router.push('/login')
    } else {
      setAutorizado(true);
    }
  }, [router]);

  if(!autorizado){
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando...</div>;
  }

  // 2. Simplificamos la función para que lea el estado 'room' directamente
  const manejarEntrarPartida = (tipo_de_partida: string) => {
    if (tipo_de_partida === 'jugador') {
      router.push(`/partida_ajedrez?tipo_partida=${tipo_de_partida}&sala=${room}`);
    } else {
      router.push(`/partida_ajedrez?tipo_partida=${tipo_de_partida}`);
    }
  }

  console.log("Los mejores commits 2026")

  return (
    <main style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>Página de inicio de ajedrez mi bro</h1>
      
      <input
        type="text"
        placeholder='Ingrese la sala'
        value={room} // Lo conectamos al estado
        onChange={(e) => setRoom(e.target.value)} // Actualizamos el estado
        style={{ padding: '8px', marginRight: '10px' }}
      />
      
      <button onClick={() => manejarEntrarPartida('jugador')} style={{ padding: '8px', marginRight: '10px' }}>
        Entrar a la partida contra jugador
      </button>
      
      <button onClick={() => manejarEntrarPartida('cpu')} style={{ padding: '8px' }}>
        Entrar a la partida contra CPU
      </button>

      {/* ========================================= */}
      {/* NUEVO BOTÓN: Redirigir a Crear Cuenta     */}
      {/* ========================================= */}
      <button 
        onClick={() => router.push('/registro')} // Cambia '/registro' por '/register' si así se llama tu carpeta
        style={{display: 'block', margin: '20px auto', background: '#333', color: 'white', padding: '10px'}}
      >
        Crear nueva cuenta
      </button>

      <button onClick={() => {
        localStorage.removeItem('ajedrez_token');
        localStorage.removeItem('ajedrez_username')
        router.push('/login');
      }}
      style={{display: 'block', margin: '20px auto', background: 'red', color: 'white', padding: '10px'}}
      >
        Cerrar Sesión
      </button>
    </main>
  );
}