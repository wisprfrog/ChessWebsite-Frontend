"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import BotonEntrarPartida from '../components/botonEntrarPartida';

export default function PaginaInicio() {
  const router = useRouter();
  const [accederInicio, setAccederInicio] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);
  const [room, setRoom] = useState('');


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
        onChange = {(e) => setRoom(e.target.value)}/>
        
        <BotonEntrarPartida tipo_de_partida="jugador" nombre_usuario={localStorage.getItem('nombre_usuario')} />
        <BotonEntrarPartida tipo_de_partida="cpu" />
      </main>
    );
  }

  return null;
}