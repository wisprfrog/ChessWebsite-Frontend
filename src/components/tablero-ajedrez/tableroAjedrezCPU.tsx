"use client";

import React, { useState, useRef, use, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';

export const TableroAjedrezCPU = ({ mostrar_tabla_movimientos }: { mostrar_tabla_movimientos: (lista_movimientos: string[]) => void }) => {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState('');
  const [optionSquares, setOptionSquares] = useState({});

  const [nombre_jugador, setNombreJugador] = useState<string | null>(null);

  const [causa_fin_partida, setCausaFinPartida] = useState<string | null>(null);
  const [ganador, setGanador] = useState<string>("");

   useEffect(() => {
    if (chessGame.isCheckmate()) {
      setCausaFinPartida("Jaque Mate");
      setGanador(chessGame.turn() === 'w' ? 'CPU' : `${nombre_jugador}`);
    } else if (chessGame.isStalemate()) {
      setCausaFinPartida("Tablas por Ahogado");
      setGanador("Empate");
    } else if (chessGame.isDraw()) {
      setCausaFinPartida("Tablas");
      setGanador("Empate");
    }
  }, [chessPosition, nombre_jugador]);

  function makeRandomMove() {
    const possibleMoves = chessGame.moves();
    if (chessGame.isGameOver() || possibleMoves.length === 0) return;

    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    chessGame.move(randomMove);
    mostrar_tabla_movimientos(chessGame.history());
    setChessPosition(chessGame.fen());
  }

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
    mostrar_tabla_movimientos(chessGame.history());
    setTimeout(makeRandomMove, 300);
    setMoveFrom('');
    setOptionSquares({});
  }

 
  function onPieceDrop({ sourceSquare, targetSquare, piece }: { sourceSquare: string, targetSquare: string | null, piece: any }) {
    // Si la sueltan fuera del tablero (null), cancelamos el movimiento
    if (!targetSquare) return false;

    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' 
      });

      setChessPosition(chessGame.fen());
      mostrar_tabla_movimientos(chessGame.history());
      setMoveFrom('');
      setOptionSquares({});
      setTimeout(makeRandomMove, 500);
      return true;
    } catch {
      return false;
    }
  }
  
const chessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    onSquareClick,
    squareStyles: optionSquares,
    id: 'jugador1-vs-jugador2-yyyy-mm-dd' 
  };

  useEffect(() => {
    const nombre_usuario_ls = localStorage.getItem("nombre_usuario");
    setNombreJugador(nombre_usuario_ls);
  })

  if (!nombre_jugador) return null;

  return (
    <div className="flex flex-col flex-1 w-full h-full min-w-0 min-h-0 justify-between items-center">
      
      {/* Etiqueta de la CPU (Arriba derecha) */}
      <div className="flex justify-end w-full mb-2">
        <p className="text-l px-4 font-bold pb-1 text-white">CPU</p>
      </div>

      {/* --- EL CONTENEDOR DEL TABLERO CON LA SOLUCIÓN DE TAMAÑO --- */}
      <div className="flex flex-1 w-full justify-center items-center min-h-0 min-w-0 overflow-hidden py-2">
        <div className="h-full w-auto aspect-square mx-auto drop-shadow-2xl">
          <Chessboard options={chessboardOptions} />
        </div>
      </div>
      
      {/* Etiqueta del Jugador Local (Abajo izquierda) */}
      <div className="flex w-full justify-start mt-2">
        <p className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
          {nombre_jugador}
        </p>
      </div>
      
    </div>
  );
};