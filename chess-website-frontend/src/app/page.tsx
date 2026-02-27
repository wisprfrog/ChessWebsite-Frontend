"use client"

import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter();

  const manejarEntrarPartida = (tipo_de_partida:string) => {
    router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}`);
  }

  return (
    <main>
      <h1>Mi aplicación Next.js</h1>
      <button onClick={() => manejarEntrarPartida('jugador')}>
        Entrar a la partida contra jugador
      </button>
      <button onClick={() => manejarEntrarPartida('cpu')}>
        Entrar a la partida contra CPU
      </button>
    </main>
    
  );
}