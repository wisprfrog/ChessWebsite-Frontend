"use client";

import { TableroAjedrez } from '@/src/components/tablero-ajedrez/tableroAjedrez';
import { TableroAjedrezCPU } from '@/src/components/tablero-ajedrez/tableroAjedrezCPU';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function PartidaAjedrezContent() {
  const searchParams = useSearchParams();
  const tipo_partida = searchParams.get('tipo_partida');
  const nombre_usuario = searchParams.get('nombre_usuario');

  return (
    <main>
      <h1>Partida de Ajedrez Contra {tipo_partida === 'cpu' ? 'CPU' : `Jugador`}</h1>
      {tipo_partida === 'cpu' ? <TableroAjedrezCPU/> : <TableroAjedrez nombre_usuario={nombre_usuario}/>}
    </main>
  );
}

export default function PaginaPartidaAjedrez() {
  return (
    <Suspense fallback={<main><h1>Cargando partida...</h1></main>}>
      <PartidaAjedrezContent />
    </Suspense>
  );
}