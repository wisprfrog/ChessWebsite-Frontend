"use client";

import NavBar from '@/components/navBar';
import Footer from '@/components/footer';
import { TableroAjedrez } from '@/components/tablero-ajedrez/tableroAjedrez';
import { TableroAjedrezCPU } from '@/components/tablero-ajedrez/tableroAjedrezCPU';
import { useSearchParams } from 'next/navigation';
import { usarAutenticar } from '@/hooks/usarAutenticar';
import { useConectarSocketMonster } from '@/hooks/conectarSocketMonster';
import { useState } from 'react';

export default function PaginaPartidaAjedrez() {
  const searchParams = useSearchParams();
  const tipo_partida = searchParams.get('tipo_partida');
  const [numSolicitudes, setNumSolicitudes] = useState(0);
  const [historialMovimientos, setHistorialMovimientos] = useState<string[]>([]);

  const mostrarTablaMovimientos = (lista_movimientos: string[]) => {
    // setHistorialMovimientos(lista_movimientos);
    console.log("Movimientos realizados en la partida mi brother: ", lista_movimientos);
  };

  const { funcionaToken, nombreUsuario } = usarAutenticar();

  function mostrarSolicitudes(solicitudes : Set<string>) {
    setNumSolicitudes(solicitudes.size);
  }
  
  const { enviarSolicitudAmistad, aceptarSolicitudAmistad, rechazarSolicitudAmistad, eliminarAmigo } = useConectarSocketMonster(null, mostrarSolicitudes);
  
  if(funcionaToken === false || nombreUsuario === null) return null;
  
  return (
    <main className='w-screen h-screen flex flex-col'>
      <NavBar cuantasSolicitudesAmistad={numSolicitudes}/>
      <div className='flex w-full justify-center items-center bg-red-500 flex-1'>
        <div className='flex w-50/100 bg-pink-500 gap-x-10'>
            {
              tipo_partida === 'cpu' ? <TableroAjedrezCPU mostrar_tabla_movimientos={mostrarTablaMovimientos}/> :
              tipo_partida === 'jugador' ? <TableroAjedrez nombre_jugador={nombreUsuario} mostrar_tabla_movimientos={mostrarTablaMovimientos} /> : 
              null /* Tablero para repeticion */
            }
            <div className='w-5/10 bg-blue-500'>
              tabla de movimientos
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}