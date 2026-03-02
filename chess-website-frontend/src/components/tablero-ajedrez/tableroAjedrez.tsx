"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { io,Socket } from 'socket.io-client';
import { on } from 'events';

export const TableroAjedrez = () => {
  

  //Logica del tablero
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

    setChessPosition(chessGame.fen());
    setMoveFrom('');
    setOptionSquares({});
  }

 
  function onPieceDrop({ sourceSquare, targetSquare, piece }: { sourceSquare: string, targetSquare: string | null, piece: any }) {
    // Si la sueltan fuera del tablero (null), cancelamos el estadoPartida
    if (!targetSquare) return false;
    
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
  

  

  
  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop : onPieceDrop,
    onSquareClick : onSquareClick,
    customSquareStyles: optionSquares,
    squareStyles: optionSquares,
    id: 'jugador1-vs-jugador2-yyyy-mm-dd' 
  };

  // --- 2. Lógica de WebSockets ---
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Inicializamos el socket dentro de useEffect para que solo ocurra una vez.
    // OJO: Asegúrate de poner 'http://'
    socketRef.current = io("http://192.168.0.1:4000");

    // 'connect' es el evento predeterminado de Socket.io cuando la conexión es exitosa
    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor de WebSockets con ID:', socketRef.current?.id);
    });

    // Escuchar los movimientos del otro jugador
    socketRef.current.on('movimiento', (fenRecibido: string) => {
      console.log('Movimiento recibido:', fenRecibido);
      // Actualizamos la lógica del ajedrez con la nueva posición
      chessGame.load(fenRecibido);
      // Actualizamos la vista del tablero
      setChessPosition(chessGame.fen());
    });

    // Limpieza: desconectar el socket si el usuario sale de la pantalla
    return () => {
      socketRef.current?.disconnect();
    };
  }, [chessGame]);

  const enviarMovimiento = (fenMovimiento: string): void => {
    console.log("Movimiento enviado:", fenMovimiento);
    socketRef.current?.emit('movimiento', fenMovimiento);
  };


  return (
    <div style={{ width: '20%',margin: '0 auto' }}>
      {/* Solo le pasamos la propiedad 'options' al componente */}
      <Chessboard options={chessboardOptions} />
    </div>
  );
};