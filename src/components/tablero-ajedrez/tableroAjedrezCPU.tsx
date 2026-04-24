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
    // Contenedor principal con las mismas dimensiones que el tablero multijugador
    <div className="flex flex-col w-content max-w-[456px] h-full min-w-0 min-h-0 lg:mr-8 gap-y-2 gap-x-2">
      
      {/* Barra superior (CPU) */}
      <div className="flex flex-row-reverse justify-start items-center w-full shrink-0 px-1 gap-x-4">
        <div className="flex flex-row-reverse items-center gap-2 min-w-0">
          <p className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-100 truncate">
            CPU
          </p>
        </div>
      </div>

      {/* Contenedor del Tablero y Modal de Fin de Partida */}
      <div className="relative flex flex-1 w-full justify-center items-center min-h-0 min-w-0">
        <div className="h-full w-auto aspect-square drop-shadow-2xl">
          <Chessboard options={chessboardOptions} />
        </div>
        {causa_fin_partida && ganador.length > 0 && (
          <div className="absolute w-full h-full flex justify-center items-center bg-[black]/40">
            <div className="flex flex-col w-content h-content justify-center items-center p-6 sm:p-10 gap-y-5 bg-slate-800">
              <p className="w-content h-content text-2xl sm:text-4xl text-center text-slate-100 font-[-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji] font-semibold">{ganador}</p>
              <p className="w-content h-content text-lg sm:text-2xl text-center text-slate-100 font-[-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji] font-bold">{causa_fin_partida}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Barra inferior (Jugador Local) */}
      <div className="flex justify-start items-center w-full shrink-0 px-1 gap-x-4">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-100 truncate">
            {nombre_jugador}
          </p>
        </div>
      </div>
    </div>
  );
};