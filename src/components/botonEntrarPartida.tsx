import React from 'react';
import { useRouter } from 'next/navigation';

export default function BotonEntrarPartida({tipo_de_partida, sala, nombre_usuario}: {tipo_de_partida:string, sala?:string, nombre_usuario?:string | null}) {
  const router = useRouter();

  const manejarEntrarPartida = () => {
    router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}`);
  }

  return(
    <button onClick={manejarEntrarPartida}>
      Partida contra {tipo_de_partida === 'cpu' ? 'CPU' : 'jugador'}
    </button>
  );
}