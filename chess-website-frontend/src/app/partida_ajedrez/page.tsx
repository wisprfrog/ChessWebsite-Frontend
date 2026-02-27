"use client";

import { TableroAjedrez } from '@/src/components/tablero-ajedrez/tableroAjedrez';
import { TableroAjedrezCPU } from '@/src/components/tablero-ajedrez/tableroAjedrezCPU';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Chessboard } from 'react-chessboard';
export default function Home() {
  const searchParams = useSearchParams();
  const tipo_partida = searchParams.get('tipo_partida');
  return (
    <main>
      <h1>Partida de Ajedrez Contra {tipo_partida === 'cpu' ? 'CPU' : 'Jugador'}</h1>
      {tipo_partida === 'cpu' ? <TableroAjedrezCPU/> : <TableroAjedrez/>}
    </main>
  );
}