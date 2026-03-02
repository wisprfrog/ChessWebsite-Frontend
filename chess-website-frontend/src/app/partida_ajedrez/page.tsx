"use client";

import { TableroAjedrez } from '@/src/components/tablero-ajedrez/tableroAjedrez';
import { TableroAjedrezCPU } from '@/src/components/tablero-ajedrez/tableroAjedrezCPU';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Chessboard } from 'react-chessboard';
export default function Home() {
  const searchParams = useSearchParams();
  const tipo_partida = searchParams.get('tipo_partida');
  const sala = searchParams.get('sala');

  return (
    <main>
      <h1>Partida de Ajedrez Contra {tipo_partida === 'cpu' ? 'CPU' : `Jugador en sala ${sala}`}</h1>
      {tipo_partida === 'cpu' ? <TableroAjedrezCPU/> : <TableroAjedrez sala={sala as string}/>}
    </main>
  );
}