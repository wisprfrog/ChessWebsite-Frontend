'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BotonConIcono from './boton';
import PopupSolicitudes from './popupSolicitudes';
import { obtenerFotoPerfilUsuario } from '../services/api';

export default function NavBar({ cuantasSolicitudesAmistad }) {
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cantidadInvitacionesPartida, setCantidadInvitacionesPartida] = useState(0);
  const [fotoPerfilUsuario, setFotoPerfilUsuario] = useState(null);
  const [cargandoFoto, setCargandoFoto] = useState(true);
  
  const solicitudesAmistadPendientes = Number(cuantasSolicitudesAmistad) || 0;
  const totalPendientesMenu = solicitudesAmistadPendientes + cantidadInvitacionesPartida;

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('nombre_usuario');
    setNombreUsuario(usuarioGuardado);
  }, []);

  useEffect(() => {
      const cargarFotoPerfil = async () => {
        if (!nombreUsuario) {
          setFotoPerfilUsuario(null);
          setCargandoFoto(false);
          return;
        }
  
        const fotoUrl = await obtenerFotoPerfilUsuario(nombreUsuario);
        setFotoPerfilUsuario(fotoUrl);
        setCargandoFoto(false);
      };
  
      cargarFotoPerfil();
    }, [nombreUsuario]);

  const manejoCierreSesion = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('nombre_usuario');
    }
    catch (error) {
      console.error('Error al cerrar sesión:', error);
    }

    setMenuAbierto(false);
  }

  const cerrarMenu = () => {
    setMenuAbierto(false);
  }

  if(cargandoFoto) return null;

  return (
    <nav className='relative m-0 w-full border-b border-sky-700/70 bg-slate-900 text-white shadow-lg shadow-black/25'>
      <div className='flex min-h-16 w-full items-center gap-3 px-4 py-4 md:px-6'>
        <div className='flex flex-1 items-center'>
          <Link href='/' className='block w-full text-center text-lg font-bold md:w-auto md:text-left md:text-3xl'>
            Monster Chess of Clans
          </Link>
        </div>

        <button
          type='button'
          className='relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-slate-800/70 text-emerald-50 transition hover:bg-slate-700 md:hidden'
          aria-expanded={menuAbierto}
          aria-controls='menu-navegacion'
          aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          onClick={() => setMenuAbierto((valorActual) => !valorActual)}
        >
          <span className='relative block h-4 w-5'>
            <span className={`absolute left-0 top-0 block h-0.5 w-5 rounded bg-current transition-all ${menuAbierto ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`absolute left-0 top-2 block h-0.5 w-5 rounded bg-current transition-all ${menuAbierto ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-4 block h-0.5 w-5 rounded bg-current transition-all ${menuAbierto ? '-translate-y-2 -rotate-45' : ''}`} />
          </span>

          {totalPendientesMenu > 0 && (
            <span className='absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white'>
              {totalPendientesMenu > 99 ? '99+' : totalPendientesMenu}
            </span>
          )}
        </button>

        <div className='hidden items-center gap-8 md:flex'>
          <Link className='font-bold text-emerald-50 hover:text-sky-300' href='/'>
            Inicio
          </Link>

          <Link href='/amigos' className='relative font-bold text-emerald-50 hover:text-sky-300'>
            Amigos

            {solicitudesAmistadPendientes > 0 && (
              <span className='absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white'>
                {solicitudesAmistadPendientes > 99 ? '99+' : solicitudesAmistadPendientes}
              </span>
            )}
          </Link>

          <PopupSolicitudes onCantidadInvitacionesChange={setCantidadInvitacionesPartida} />


          <Link href={`/perfil?usuario=${nombreUsuario}`}>
            {fotoPerfilUsuario ? (
              <img
                src={fotoPerfilUsuario}
                alt={`Foto de perfil de ${nombreUsuario}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <img
                src="/assets/icons/userProfile.svg"
                alt={`Foto de perfil de ${nombreUsuario}`}
                className="h-10 w-10 rounded-full"
              />
            )}
          </Link>


          <Link href='/inicio_sesion' onClick={manejoCierreSesion}>
            <BotonConIcono className='flex h-fit w-fit items-center justify-center rounded-full p-1 hover:bg-rose-400/30' tamanioIcon='h-6 w-auto' size='icon' ruta_icono='/assets/icons/logOut.svg' variant='ghost' />
          </Link>
        </div>
      </div>

      <div
        id='menu-navegacion'
        className={`${menuAbierto ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'} absolute right-4 top-[calc(100%+0.5rem)] z-50 flex w-[min(22rem,calc(100%-2rem))] flex-col items-end gap-4 rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-black/40 backdrop-blur transition-all duration-300 ease-in-out md:hidden`}
      >
        <Link className='w-full rounded-lg px-3 py-2 text-right font-bold text-emerald-50 hover:bg-slate-800 hover:text-sky-300' href='/' onClick={cerrarMenu}>
          Inicio
        </Link>

        <Link className='relative w-full rounded-lg px-3 py-2 text-right font-bold text-emerald-50 hover:bg-slate-800 hover:text-sky-300' href='/amigos' onClick={cerrarMenu}>
          Amigos

          {solicitudesAmistadPendientes > 0 && (
            <span className='ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white'>
              {solicitudesAmistadPendientes > 99 ? '99+' : solicitudesAmistadPendientes}
            </span>
          )}
        </Link>

         <div onClick={cerrarMenu} className='w-full'>
          <PopupSolicitudes usarTriggerTexto />
        </div>

        <Link href={`/perfil?usuario=${nombreUsuario}`} onClick={cerrarMenu}>
          <div className='flex w-full items-center justify-end gap-3 rounded-lg px-3 py-2 text-right font-bold text-emerald-50 hover:bg-slate-800 hover:text-sky-300'>
            <span>Perfil</span>
          </div>
        </Link>

        <Link href='/inicio_sesion' onClick={manejoCierreSesion}>
          <div className='flex w-full items-center justify-end gap-3 rounded-lg px-3 py-2 text-right font-bold text-red-500 hover:bg-slate-800 hover:text-rose-300'>
            <span>Cerrar sesión</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}