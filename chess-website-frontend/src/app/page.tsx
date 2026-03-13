"use client"

import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter();

  const [autorizado,setAutorizado] = useState(false);

  useEffect(() => {
    
    const token = localStorage.getItem('ajedrez_token');
  
    if (!token){
      router.push('/login')
    } else{
      setAutorizado(true);
    }
  },[router]);

  if(!autorizado){
    return <div style={{textAlign: 'center', marginTop: '50'}}>Cargando...</div>;
  }

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


  console.log("Los mejores commits 2026")

  return (
    <main style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>Página de inicio de ajedrez mi bro</h1>
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

      <button onClick={() => {
        localStorage.removeItem('ajedrez_token');
        localStorage.removeItem('ajedrez_username')
        router.push('/login');
      }}
      style={{display: 'block',margin: '20px auto', background: 'red', color: 'white'}}
      >Cerrar Sesión
      </button>
    </main>
    
  );
}