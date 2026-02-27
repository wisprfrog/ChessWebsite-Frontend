import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

// 1. Envolvemos todo en un Custom Hook
export const usePartidaSocket = () => {
  const receiveMovimiento = movimiento => setMovimiento(movimiento);
  
  const [partida, setPartida] = useState("");

  const [movimiento, setMovimiento] = useState("");
  //Antes de entrar a ueva sala, se desconecta de la sala anterior
  const unirse_partida = () => {
    if (partida !== "") {
      socket.emit('unirse_partida', partida);
    }
  }

  const handleSubmit = () => {
    socket.emit('movimiento', {movimiento, partida});
    //setMovimiento("");  //para limpiar el input después de enviar
  };

  useEffect(() => {
    socket.on('movimiento', (jugada) => {
      console.log('Received movimiento:', jugada);
      setMovimiento(jugada);
    });

    return () => {
      socket.off('movimiento');
    }
  }, []);

    return {
        partida,
        setPartida,
        movimiento,
        setMovimiento,
        unirse_partida,
        handleSubmit
    };
};