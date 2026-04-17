'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import BotonConIcono from './boton';

export default function NavBar() {
  const [nombreUsuario, setNombreUsuario] = useState(null);
  
  const [cantidadSolicitudes, setCantidadSolicitudes] = useState(1); 

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('nombre_usuario');
    setNombreUsuario(usuarioGuardado);
  }, []);

  const manejoCierreSesion = () => {
    try{
      localStorage.removeItem('token');
      localStorage.removeItem('nombre_usuario');
    }
    catch(error){
      console.error('Error al cerrar sesión:', error);
    }
  }

  return (
    <nav className='w-full h-min-16 h-16 m-0 p-4 flex items-center justify-between bg-gray-900 text-white'>
      <div className='w-2/3 h-full flex items-center justify-between'>
        <h1>Monster Chess of Clans</h1>
      </div>
      <div className='w-1/3 h-full flex items-center justify-between mr-4'>    
        <Link href="/">Inicio</Link>
        
        <Link href={`/amigos`} className="relative">
          Amigos
          
          {}
          {cantidadSolicitudes > 0 && (
            <span 
              className="absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              {}
              {cantidadSolicitudes > 99 ? '99+' : cantidadSolicitudes}
            </span>
          )}
        </Link>

<Link href={`/perfil?usuario=${nombreUsuario}`}>
          <BotonConIcono className='flex justify-center items-center w-fit h-fit p-1 rounded-full hover:bg-yellow-100' tamanioIcon='h-6 w-auto' size='icon' ruta_icono="/assets/icons/userProfile.svg" variant="ghost" />
        </Link>

        <Link href="/inicio_sesion" onClick={manejoCierreSesion}>
          <BotonConIcono className='flex justify-center items-center w-fit h-fit p-1 rounded-full hover:bg-red-200' tamanioIcon='h-6 w-auto' size='icon' ruta_icono="/assets/icons/logOut.svg" variant="ghost" />







        </Link>
      </div>
    </nav>
  );
}