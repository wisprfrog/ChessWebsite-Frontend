'use client'

import Link from 'next/link';

export default function NavBar() {
    
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
    <nav>
      <div>
        <h1>Monster Chess of Clans</h1>
      </div>
      <div>    
        <Link href="/">Inicio</Link>
        <Link href="/amigos">Amigos</Link>
        <Link href="/perfil">Perfil</Link>
        <Link href="/inicio_sesion" onClick={manejoCierreSesion}>Cerrar sesion</Link>
      </div>
    </nav>
  );
}