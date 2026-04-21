'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import BotonConIcono from './boton';
import PopupSolicitudes from './popupSolicitudes';

export default function NavBar({ cuantasSolicitudesAmistad }) {
  const [nombreUsuario, setNombreUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('nombre_usuario');
    setNombreUsuario(usuarioGuardado);
  }, []);

  const manejoCierreSesion = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('nombre_usuario');
    }
    catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  return (
    <nav className='m-0 flex h-16 w-full items-center justify-between border-b border-sky-700/70 bg-slate-900 text-white shadow-lg shadow-black/25 p-4'>
      <div className='w-2/3 h-full flex items-center justify-between ml-10 text-2xl font-bold'>
        <Link href="/">Monster Chess of Clans</Link>
      </div>
      <div className='w-1/3 h-full flex items-center justify-between mr-2'>    
        <Link className="font-bold text-emerald-50 hover:text-sky-300" href="/">
          Inicio
        </Link>

        <Link href={`/amigos`} className="relative font-bold text-emerald-50 hover:text-sky-300">
          Amigos

          {cuantasSolicitudesAmistad > 0 && (
            <span
              className="absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              { }
              {cuantasSolicitudesAmistad > 99 ? '99+' : cuantasSolicitudesAmistad}
            </span>
          )}
        </Link>

        <Link href={`/perfil?usuario=${nombreUsuario}`}>
          <BotonConIcono className='flex h-fit w-fit items-center justify-center rounded-full p-1 hover:bg-slate-700/80' tamanioIcon='h-6 w-auto' size='icon' ruta_icono="/assets/icons/userProfile.svg" variant="ghost" />
        </Link>

        <PopupSolicitudes />

        <Link href="/inicio_sesion" onClick={manejoCierreSesion}>
          <BotonConIcono className='flex h-fit w-fit items-center justify-center rounded-full p-1 hover:bg-rose-400/30' tamanioIcon='h-6 w-auto' size='icon' ruta_icono="/assets/icons/logOut.svg" variant="ghost" />
        </Link>
      </div>
    </nav>
  );
}