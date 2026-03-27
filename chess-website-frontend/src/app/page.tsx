"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function PaginaInicio() {
  const router = useRouter();
  const [accederInicio, setAccederInicio] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);

  const manejarEntrarPartida = (tipo_de_partida:string, sala?:string, id_usuario?:number) => {

    if(tipo_de_partida === 'jugador'){
      router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}&sala=${sala}&id_usuario=${id_usuario}`);
    }
    else{
      router.push(`./partida_ajedrez?tipo_partida=${tipo_de_partida}`);
    }
  }

  let room = '';


  console.log("Los mejores commits 2026")

  useEffect(() => {
    const enviarToken = async () => {
      let respuesta = null;
  
      const url_api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      respuesta = await fetch(`${url_api}/api/usuario/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if(respuesta.ok) setAccederInicio(true);

        setVerificandoToken(false);
    }

    if(localStorage.getItem('token')){
      try{
        enviarToken();
      }
      catch(error){
        console.error('Error al verificar el token:', error);
        localStorage.removeItem('token');
        setVerificandoToken(false);
      }
    }
    else setVerificandoToken(false);
  }, []);

  useEffect(() => {
    if(!verificandoToken && !accederInicio) router.push('./inicio_sesion');
  }, [verificandoToken, accederInicio, router]);

  if(accederInicio){
    return (
      <main>
        <h1>Página de inicio de ajedrez mi bro</h1>
        <input
        type="text"
        placeholder='Ingrese la sala'
        onChange = {(e) => room = e.target.value}/>
        
        <button onClick={() => manejarEntrarPartida('jugador', room, new Date().getSeconds())}>
          Entrar a la partida contra jugador
        </button>
        <button onClick={() => manejarEntrarPartida('cpu')}>
          Entrar a la partida contra CPU
        </button>
      </main>
    );
  }

  return null;
}