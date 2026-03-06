"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { io, Socket } from 'socket.io-client';

export const TableroAjedrez = ({sala}: {sala: string}) => {
  //Rol del jugador
  const [rolJugador, setRolJugador] = useState<'b'| 'w'| 's'>('w')
  const rolJugadorRef = useRef<'b'| 'w'| 's'>('w');
  
  // --------------- Logica del tablero ---------------
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState('');
  const [optionSquares, setOptionSquares] = useState({});

  function getMoveOptions(square: Square) {
    const moves = chessGame.moves({ square, verbose: true });
    
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};
    for (const move of moves) {
      const isCapture = chessGame.get(move.to as Square) && chessGame.get(move.to as Square)?.color !== chessGame.get(square)?.color;
      
      newSquares[move.to] = {
        background: isCapture 
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' 
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    }
    
    newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };
    setOptionSquares(newSquares);
    return true;
  }

 
  function onSquareClick({ square, piece }: { square: string, piece?: any }) {
    if(rolJugadorRef.current !== chessGame.turn()) return;
    const sq = square as Square;
    
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(sq);
      if (hasMoveOptions) setMoveFrom(sq);
      return;
    }

    const moves = chessGame.moves({ square: moveFrom as Square, verbose: true });
    const foundMove = moves.find(m => m.from === moveFrom && m.to === sq);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(sq);
      setMoveFrom(hasMoveOptions ? sq : '');
      return;
    }

    try {
      chessGame.move({ from: moveFrom, to: sq, promotion: 'q' });
    } catch {
      const hasMoveOptions = getMoveOptions(sq);
      if (hasMoveOptions) setMoveFrom(sq);
      return;
    }

    enviarMovimiento(chessGame.fen());

    setChessPosition(chessGame.fen());
    setMoveFrom('');
    setOptionSquares({});
  }

 
  function onPieceDrop({ sourceSquare, targetSquare, piece }: { sourceSquare: string, targetSquare: string | null, piece: any }) {
    // Si la sueltan fuera del tablero (null), cancelamos el estadoPartida
    if (!targetSquare || rolJugadorRef.current !== chessGame.turn()) return false;

    //si no es tu turno no te deja mover
    console.log("Este es el rol del jugador: ", rolJugadorRef.current)
    console.log("Turno real: ", chessGame.turn())
    if (rolJugadorRef.current != chessGame.turn()) return false;

    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' 
      });

      enviarMovimiento(chessGame.fen());
      setChessPosition(chessGame.fen());
      setMoveFrom('');
      setOptionSquares({});

      return true;

    } catch (error) {
      return false;
    }
  
  }
  
  // --------------- Logica de los relojes ---------------
  const [tiempo_jugador, setTiempoJugador] = useState('10:00');
  const [tiempo_oponente, setTiempoOponente] = useState('10:00');

  function ms_a_minutos_segundos(tiempo_ms: any) {
    const totalSeconds = Math.max(0, Math.floor(tiempo_ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // --------------- Logica de los nombres ---------------
  const [Nombre_jugador, setNombreJugador] = useState('Jugador');
  const [Nombre_oponente, setNombreOponente] = useState('Oponente');
  
  // --------------- Lógica de WebSockets ---------------
  const socketRef = useRef<Socket | null>(null);
  const [orientacionTablero, setOrientacionTablero] = useState<"white" | "black">("white");

  useEffect(() => {
    // Inicializamos el socket dentro de useEffect para que solo ocurra una vez.
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");
    
    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor de WebSockets con ID:', socketRef.current?.id);

      socketRef.current?.emit('unirse_sala', sala);
    });

    socketRef.current.on("asignar_rol", (rol_asignado: string) => {
      // console.log("Rol asignado por el servidor:", rol_asignado);

      if (rol_asignado === 'white') {
        setRolJugador('w')
        rolJugadorRef.current = 'w';
      }
      else if(rol_asignado === 'black'){
        setRolJugador('b')
        rolJugadorRef.current = 'b';
      }
      else {
        setRolJugador('s')
        rolJugadorRef.current = 's';
      }
      
      setOrientacionTablero(rolJugadorRef.current === 'b' ? 'black':'white');
    });
    
    
    // Escuchar los movimientos del otro jugador
    socketRef.current.on('movimiento', (data) => {

      // Actualizamos la lógica del ajedrez con la nueva posición
     chessGame.load(data.fenMovimiento);

     // Actualizamos la vista del tablero
     setChessPosition(chessGame.fen());
    });
    
    socketRef.current.on('actualizar_tiempos', (tiempo_restante) => {
      let tiempo_restante_jugador = rolJugadorRef.current === 'w' ? tiempo_restante.blancas : tiempo_restante.negras;
      let tiempo_restante_oponente = rolJugadorRef.current === 'w' ? tiempo_restante.negras : tiempo_restante.blancas;
      
      setTiempoJugador(ms_a_minutos_segundos(tiempo_restante_jugador));
      setTiempoOponente(ms_a_minutos_segundos(tiempo_restante_oponente));
    });
    
    
    // Limpieza: desconectar el socket si el usuario sale de la pantalla
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const enviarMovimiento = (fenMovimiento: string): void => {
    socketRef.current?.emit('movimiento', {fenMovimiento, sala});
  };

  // --------------- Configuración del componente Chessboard ---------------

  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop : onPieceDrop,
    onSquareClick : onSquareClick,
    customSquareStyles : optionSquares,
    boardOrientation : orientacionTablero,
    squareStyles: optionSquares,
    id: 'jugador1-vs-jugador2-yyyy-mm-dd' 
  };


  return (
    <div style={{width: '20%',margin: '0 auto'}}>
      <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
        <p style={{width: '80%'}}>{Nombre_oponente}</p>
        <div style={{backgroundColor: 'grey', padding: '5px', marginBottom: '20px', fontSize: '30px'}}>
          {tiempo_oponente}
        </div>
      </div>
      <Chessboard options={chessboardOptions} /> {/* Solo le pasamos la propiedad 'options' al componente */}
      <div style={{width: '100%', display: 'flex', flexDirection: 'row-reverse'}}>
        <p style={{width: '80%', textAlign: 'right'}}>{Nombre_jugador}</p>
        <div style={{backgroundColor: 'grey', padding: '5px', marginTop: '20px', fontSize: '30px'}}>
          {tiempo_jugador}
        </div>
      </div>
    </div>
  );
};