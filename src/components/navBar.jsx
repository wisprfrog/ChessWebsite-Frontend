'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BotonConIcono from './boton';
import PopupSolicitudes from './popupSolicitudes';
import { buscarUsuariosPorNombre, obtenerFotoPerfilUsuario, obtenerIdUsuario } from '../services/api';

export default function NavBar({ cuantasSolicitudesAmistad }) {
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const [usuarioBusqueda, setUsuarioBusqueda] = useState('');
  const [mensajeBusqueda, setMensajeBusqueda] = useState('');
  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cantidadInvitacionesPartida, setCantidadInvitacionesPartida] = useState(0);
  const [fotoPerfilUsuario, setFotoPerfilUsuario] = useState(null);
  const [cargandoFoto, setCargandoFoto] = useState(true);
  const contenedorBusquedaRef = useRef(null);
  const requestBusquedaRef = useRef(0);
  const router = useRouter();
  
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

  useEffect(() => {
    const manejarClickFuera = (evento) => {
      if (!contenedorBusquedaRef.current?.contains(evento.target)) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener('mousedown', manejarClickFuera);
    return () => {
      document.removeEventListener('mousedown', manejarClickFuera);
    };
  }, []);

 useEffect(() => {
    const texto = usuarioBusqueda.trim();

    if (texto.length < 1) {
      setSugerenciasBusqueda([]);
      setMostrarSugerencias(false);
      setCargandoSugerencias(false);
      return;
    }

    setMostrarSugerencias(true);

    const timeoutId = setTimeout(async () => {
      const idSolicitud = requestBusquedaRef.current + 1;
      requestBusquedaRef.current = idSolicitud;
      setCargandoSugerencias(true);

      const resultados = await buscarUsuariosPorNombre(texto);

      if (requestBusquedaRef.current !== idSolicitud) {
        setCargandoSugerencias(false);
        return;
      }

      setSugerenciasBusqueda(resultados);
      setMostrarSugerencias(true);
      setCargandoSugerencias(false);
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      setCargandoSugerencias(false);
    };
  }, [usuarioBusqueda]);
  
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

  const irAPerfil = (usuario) => {
    const usuarioNormalizado = typeof usuario === 'string' ? usuario.trim() : '';

    if (!usuarioNormalizado) {
      setMensajeBusqueda('Escribe un usuario para buscarlo.');
      return;
    }

    setUsuarioBusqueda(usuarioNormalizado);
    setMostrarSugerencias(false);
    setSugerenciasBusqueda([]);
    setMensajeBusqueda('');
    router.push(`/perfil?usuario=${encodeURIComponent(usuarioNormalizado)}`);
  }

  const manejarBuscarUsuario = (event) => {
    event.preventDefault();

    const usuario = usuarioBusqueda.trim();

    if (!usuario) {
      setMensajeBusqueda('Escribe un usuario para buscarlo.');
      return;
    }

    const validarYBuscar = async () => {
      const idUsuario = await obtenerIdUsuario(usuario);

      if (!idUsuario) {
        setMensajeBusqueda('No se encontró usuario con ese nombre.');
        return;
      }

      irAPerfil(usuario);
    };

    validarYBuscar();
  };

  if(cargandoFoto) return null;

  return (
    <nav className='relative m-0 w-full border-b border-sky-700/70 bg-slate-900 text-white shadow-lg shadow-black/25'>
      <div className='flex flex-col md:flex-row md:justify-between min-h-16 w-full items-center gap-3 px-4 py-4 md:px-6'>
        <div className='flex flex-1 items-center'>
          <Link href='/' className='block w-full text-center text-lg font-bold md:w-auto md:text-left md:text-3xl'>
            Monster Chess of Clans
          </Link>
        </div>

        <div className='flex items-center gap-4'> 

           <div ref={contenedorBusquedaRef} className='relative w-full md:w-64'>
            <form className='relative' onSubmit={manejarBuscarUsuario}>
              <input
                type='text'
                placeholder='Buscar Perfil'
                value={usuarioBusqueda}
                onFocus={() => {
                  if (sugerenciasBusqueda.length > 0) {
                    setMostrarSugerencias(true);
                  }
                }}
                onChange={(event) => {
                  setUsuarioBusqueda(event.target.value);
                  if (mensajeBusqueda) {
                    setMensajeBusqueda('');
                  }
                }}
                className='h-10 w-full rounded-lg border border-white/10 bg-slate-800/70 px-4 pr-10 text-sm text-white focus:border-sky-500 focus:outline-none'
              />
              <button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </button>
            </form>
            
            {mostrarSugerencias ? (
              <ul className='absolute left-0 top-full z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-white/10 bg-slate-900/95 p-1 shadow-lg shadow-black/40'>
                {cargandoSugerencias ? (
                  <li className='px-3 py-2 text-sm text-slate-300'>Buscando...</li>
                ) : null}

                {!cargandoSugerencias && sugerenciasBusqueda.length === 0 ? (
                  <li className='px-3 py-2 text-sm text-slate-300'>No hay coincidencias.</li>
                ) : null}

                {!cargandoSugerencias && sugerenciasBusqueda.map((sugerencia) => (
                  <li key={sugerencia}>
                    <button
                      type='button'
                      onClick={() => irAPerfil(sugerencia)}
                      className='w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-slate-700/80'
                    >
                      {sugerencia}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {mensajeBusqueda ? (
              <p className='mt-1 text-xs text-rose-300'>{mensajeBusqueda}</p>
            ) : null}

          </div>

          <button
            type='button'
            className='relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-slate-800/70 text-emerald-50 transition hover:bg-slate-700 lg:hidden'
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


        </div>

        <div className='hidden items-center gap-8 lg:flex'>
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
        className={`${menuAbierto ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'} absolute right-4 top-[calc(100%+0.5rem)] z-50 flex w-[min(22rem,calc(100%-2rem))] flex-col items-end gap-4 rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-black/40 backdrop-blur transition-all duration-300 ease-in-out lg:hidden`}
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