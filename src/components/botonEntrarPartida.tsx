"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BotonEntrarPartida({tipo_de_partida}: {tipo_de_partida:string}) {
  const router = useRouter();

  const manejarEntrarPartida = () => {
    router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}`);
  }

  return(
    <button onClick={manejarEntrarPartida}>
      {tipo_de_partida === 'cpu' ? 'CPU' : 'jugador'}
    </button>
  );
}