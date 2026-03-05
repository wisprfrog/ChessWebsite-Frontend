"use client"

import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter();

  const manejarEntrarPartida = (tipo_de_partida:string, sala?:string) => {
    router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}`);

    if(tipo_de_partida === 'jugador'){
      router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}&sala=${sala}`);
    }
    else{
      router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}`);
    }
  }

  let room = '';

  return (
    <main>
      <h1>Página de inicio de ajedrez</h1>
      <input
      type="text"
      placeholder='Ingrese la sala'
      onChange = {(e) => room = e.target.value}/>
      
      <button onClick={() => manejarEntrarPartida('jugador', room)}>
        Entrar a la partida contra jugador
      </button>
      <button onClick={() => manejarEntrarPartida('cpu')}>
        Entrar a la partida contra CPU
      </button>
    </main>
    
  );
}