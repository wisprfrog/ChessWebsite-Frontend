'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [nombreUsuario, setNombreUsuario] = useState(null);

  useEffect(() => {
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    setNombreUsuario(nombreUsuario);
  }, []);

  const manejoCierreSesion = () => {
    //borrar el token de autenticacion del almacenamiento local
    try{
      localStorage.removeItem('token');
      localStorage.removeItem('nombre_usuario');
    }
    catch(error){
      console.error('Error al cerrar sesión:', error);
    }
  }

  return (
    <nav className='w-full h-16 m-0 p-0 flex items-center justify-between bg-gray-900 text-white'>
      <div className='w-1/3 h-full flex items-center justify-between p-4 bg-pink-500'>
        <h1>Monster Chess of Clans</h1>
      </div>
      <div className='w-2/3 h-full flex items-center justify-between p-4 bg-red-500'>    
        <Link href="/">Inicio</Link>
        <Link href="/amigos">Amigos</Link>
        <Link href={`/perfil?usuario=${nombreUsuario}`}>Perfil</Link>
        <Link href="/inicio_sesion" onClick={manejoCierreSesion}>Cerrar sesion</Link>
      </div>
    </nav>
  );
}