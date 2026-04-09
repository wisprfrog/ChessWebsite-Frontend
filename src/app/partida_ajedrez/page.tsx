"use client";

import NavBar from '@/src/components/navBar';
import { TableroAjedrez } from '@/src/components/tablero-ajedrez/tableroAjedrez';
import { TableroAjedrezCPU } from '@/src/components/tablero-ajedrez/tableroAjedrezCPU';
import { useSearchParams } from 'next/navigation';
import { usarAutenticar } from '@/src/hooks/usarAutenticar';

export default function PaginaPartidaAjedrez() {
  const searchParams = useSearchParams();
  const tipo_partida = searchParams.get('tipo_partida');

  const { funcionaToken, nombreUsuario } = usarAutenticar();

  if(funcionaToken === false || nombreUsuario === null) return null;

  return (
    <main>
      <NavBar />
      <h1>Partida de Ajedrez Contra {tipo_partida === 'cpu' ? 'CPU' : `Jugador`}</h1>
      {tipo_partida === 'cpu' ? <TableroAjedrezCPU/> : <TableroAjedrez nombre_jugador={nombreUsuario} />}
    </main>
  );
}