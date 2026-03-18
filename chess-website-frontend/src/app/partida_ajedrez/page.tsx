"use client";

import { TableroAjedrez } from '@/src/components/tablero-ajedrez/tableroAjedrez';
import { TableroAjedrezCPU } from '@/src/components/tablero-ajedrez/tableroAjedrezCPU';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function PartidaAjedrezContent() {
  const searchParams = useSearchParams();
  const tipo_partida = searchParams.get('tipo_partida');
  const sala = searchParams.get('sala');
  const id_usuario_conectado = searchParams.get('id_usuario');

  return (
    <main>
      <h1>Partida de Ajedrez Contra {tipo_partida === 'cpu' ? 'CPU' : `Jugador en sala ${sala}`}</h1>
      {tipo_partida === 'cpu' ? <TableroAjedrezCPU/> : <TableroAjedrez sala={sala as string} id_usuario={Number(id_usuario_conectado)}/>}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main><h1>Cargando partida...</h1></main>}>
      <PartidaAjedrezContent />
    </Suspense>
  );
}