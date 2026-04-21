"use client";
import React, { useState, useRef, useEffect, use } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { io, Socket } from "socket.io-client";

export const TableroAjedrez = ({nombre_jugador, manejarVisibilidadTablaMovimientos, mostrar_tabla_movimientos} : { nombre_jugador: string, manejarVisibilidadTablaMovimientos: (visible: boolean) => void, mostrar_tabla_movimientos: (lista_movimientos: string[]) => void }) => {
  //Rol del jugador
  const [rolJugador, setRolJugador] = useState<"b" | "w" | "s">("w");
  const rolJugadorRef = useRef<"b" | "w" | "s">("s");

  // --------------- Logica del tablero ---------------
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [causa_fin_partida, setCausaFinPartida] = useState<string | null>(null);
  const [ganador, setGanador] = useState("");
  const [lista_movimientos, setListaMovimientos] = useState<string[]>([]);

  function getMoveOptions(square: Square) {
    const moves = chessGame.moves({ square, verbose: true });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};
    for (const move of moves) {
      const isCapture =
        chessGame.get(move.to as Square) &&
        chessGame.get(move.to as Square)?.color !==
        chessGame.get(square)?.color;

      newSquares[move.to] = {
        background: isCapture
          ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
          : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }

    newSquares[square] = { background: "rgba(255, 255, 0, 0.4)" };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick({ square, piece }: { square: string; piece?: any }) {
    if (rolJugadorRef.current !== chessGame.turn()) return;
    const sq = square as Square;

    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(sq);
      if (hasMoveOptions) setMoveFrom(sq);
      return;
    }

    const moves = chessGame.moves({
      square: moveFrom as Square,
      verbose: true,
    });
    const foundMove = moves.find((m) => m.from === moveFrom && m.to === sq);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(sq);
      setMoveFrom(hasMoveOptions ? sq : "");
      return;
    }

    try {
      chessGame.move({ from: moveFrom, to: sq, promotion: "q" });
    } catch {
      const hasMoveOptions = getMoveOptions(sq);
      if (hasMoveOptions) setMoveFrom(sq);
      return;
    }

    enviarMovimiento({ from: moveFrom, to: sq, promotion: "q" } as {
      from: string;
      to: string;
      promotion: string;
    });

    setChessPosition(chessGame.fen());
    setMoveFrom("");
    setOptionSquares({});
  }

  function onPieceDrop({
    sourceSquare,
    targetSquare,
    piece,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
    piece: any;
  }) {
    // Si la sueltan fuera del tablero (null), cancelamos el estadoPartida
    if (!targetSquare || rolJugadorRef.current !== chessGame.turn())
      return false;

    //si no es tu turno no te deja mover
    if (rolJugadorRef.current != chessGame.turn()) return false;

    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      enviarMovimiento({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      } as { from: string; to: string; promotion: string });
      setChessPosition(chessGame.fen());
      //mostrar_tabla_movimientos(chessGame.history());
      setMoveFrom("");
      setOptionSquares({});
      return true;
    } catch (error) {
      return false;
    }
  }

  // --------------- Logica de los relojes ---------------
  const [tiempo_jugador, setTiempoJugador] = useState("10:00");
  const [tiempo_oponente, setTiempoOponente] = useState("10:00");

  function ms_a_minutos_segundos(tiempo_ms: any) {
    const totalSeconds = Math.max(0, Math.floor(tiempo_ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // --------------- Logica de los nombres ---------------
  const [nombre_oponente, setNombreOponente] = useState("Oponente");

  // --------------- Lógica de WebSockets ---------------
  const [sala, setSala] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [orientacionTablero, setOrientacionTablero] = useState<"white" | "black">("white");

  useEffect(() => {
    if(!nombre_jugador) return;

    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/juego",
      {
        auth: {
          nombre_usuario_actual: nombre_jugador,
        },
      },
    );

    socketRef.current?.on("connect", () => {
      console.log("Conectando al chess mi bro");
    });

    socketRef.current?.on("connect_error", (error) => {
      console.error("Error de conexión:", error);
    });

    socketRef.current?.on(
      "intentar_reconexion",
      ({ sala_a_reconectar, nombre_usuario_conectado }) => {
        if(nombre_usuario_conectado == nombre_jugador){
          console.log(`Intentando reconectar a la sala ${sala_a_reconectar}...`);
          if(sala_a_reconectar !== null){
            console.log(`Reconexion exitosa a la sala ${sala_a_reconectar}`);
            setSala(sala_a_reconectar);
          }
          else{
            if(localStorage.getItem("sala_partida_amigos")){
              console.log("te espera una partida con tus amigos mi bro :)");
              const sala_guardada = localStorage.getItem("sala_partida_amigos");
              localStorage.removeItem("sala_partida_amigos");

              setSala(sala_guardada);
            }
            else{
              console.log("no te espera ninguna partida con tus amigos, buscando partida aleatoria...");
              socketRef.current?.emit("buscar_partida", nombre_jugador);
            }
          }
        }
      },
    );

    socketRef.current?.on(
      "partida_encontrada",
      ({
        sala_asignada,
        nombre_usuario1,
        nombre_usuario2,
      }) => {
        if(sala_asignada !== null && (nombre_usuario1 === nombre_jugador || nombre_usuario2 === nombre_jugador)){
          setSala(sala_asignada);
        }
      },
    );

    socketRef.current?.on("cargar_juego", ({fenPartida, nombre_usuario_blancas, nombre_usuario_negras, historial_juego}: {
        fenPartida: any | null; nombre_usuario_blancas: string; nombre_usuario_negras: string; historial_juego: string[];}) => {
        // Procesar los datos del juego
        if (fenPartida !== null) {
          chessGame.load(fenPartida);
          setChessPosition(chessGame.fen());
          setListaMovimientos(historial_juego);
          console.log("lista", historial_juego);
        }

        mostrar_tabla_movimientos(historial_juego ?? []);
        
        setNombreOponente(
          nombre_jugador == nombre_usuario_blancas
            ? nombre_usuario_negras
            : nombre_usuario_blancas,
        );
      },
    );

    socketRef.current?.on("asignar_rol", (rol_asignado: string) => {
      if (rol_asignado === "white") {
        setRolJugador("w");
        rolJugadorRef.current = "w";
      } else if (rol_asignado === "black") {
        setRolJugador("b");
        rolJugadorRef.current = "b";
      } else {
        setRolJugador("s");
        rolJugadorRef.current = "s";
      }

      setOrientacionTablero(rolJugadorRef.current === "b" ? "black" : "white");
    });

    socketRef.current?.on("actualizar_tiempos", (tiempo_restante) => {
      let tiempo_restante_jugador =
        rolJugadorRef.current === "w"
          ? tiempo_restante.blancas
          : tiempo_restante.negras;
      let tiempo_restante_oponente =
        rolJugadorRef.current === "w"
          ? tiempo_restante.negras
          : tiempo_restante.blancas;

      setTiempoJugador(ms_a_minutos_segundos(tiempo_restante_jugador));
      setTiempoOponente(ms_a_minutos_segundos(tiempo_restante_oponente));
    });

    socketRef.current?.on(
      "terminar_partida",
      ({ causa_fin_partida, ganador }: { causa_fin_partida: string; ganador: string }) => {
        setCausaFinPartida(causa_fin_partida);
        console.log(`Causa de fin de partida: ${causa_fin_partida}, ganador: ${ganador}`);
        setGanador(ganador === "Empate" ? ganador : `Ganador: ${ganador}`);
      },
    );

    // Limpieza: desconectar el socket si el usuario sale de la pantalla
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if(sala !== null){
      console.log(`Uniendose a la sala a la sala: ${sala}`);
      socketRef.current?.emit("unirse_sala", {
        sala: sala,
        nombre_jugador,
      });
      manejarVisibilidadTablaMovimientos(true);
    }
    else manejarVisibilidadTablaMovimientos(false);
  }, [sala]);

  const enviarMovimiento = (
    estructura_movimiento:
      | { from?: string; to?: string; promotion?: string }
      | string,
  ): void => {
    socketRef.current?.emit("movimiento", {
      estructura_movimiento,
      sala: sala,
    });
  };

  // --------------- Configuración del componente Chessboard ---------------

  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop: onPieceDrop,
    onSquareClick: onSquareClick,
    customSquareStyles: optionSquares,
    boardOrientation: orientacionTablero,
    squareStyles: optionSquares,
    id: "jugador1-vs-jugador2-yyyy-mm-dd",
  };

  if(!nombre_jugador || !sala){
    return (
      <div className="flex flex-1 justify-center items-center">
        <p className="text-5xl text-emerald-300 animate-pulse font-semibold">Buscando partida...</p>
      </div>
    );
  }

  return (
    // h-full asegura que tome la altura del cuadro padre. 
    // mr-8 empuja la tabla de movimientos hacia la derecha.
    <div className="flex flex-col flex-1 w-full min-w-0 min-h-0 mr-8">
      
      {/* Barra superior (Oponente) */}
      <div className="flex justify-between items-center w-full mb-4 shrink-0 px-2">
        <p className="text-xl font-bold text-slate-100 truncate pr-4">{nombre_oponente}</p>
        <div className="bg-slate-800 text-amber-400 font-mono text-2xl px-4 py-1 rounded shadow-inner border border-slate-700">
          {tiempo_oponente}
        </div>
      </div>

      {/* Contenedor del Tablero */}
      <div className="relative flex flex-1 w-full justify-center items-center min-h-0 min-w-0">
        <div className=" h-full w-auto aspect-square drop-shadow-2xl">
          <Chessboard options={chessboardOptions} />
        </div>
          {
            causa_fin_partida && ganador.length > 0 && (
              <div className="absolute w-full h-full flex justify-center items-center bg-[black]/40">
                <div className="flex flex-col w-content h-content justify-center items-center p-10 gap-y-5 rounded-lg bg-slate-800">
                  <p className="w-content h-content text-4xl text-center text-[#fef3c7] font-[-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji] font-semibold">{ganador}</p>
                  <p className="w-content h-content text-2xl text-center text-[#fef3c7] font-[-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji] font-bold">{causa_fin_partida}</p>
                </div>
              </div>
            )
          }
      </div>
      
      {/* Barra inferior (Jugador Local) */}
      <div className="flex justify-between items-center w-full mt-4 shrink-0 px-2">
        <p className="text-xl font-bold text-slate-100 truncate pr-4">{nombre_jugador}</p>
        <div className="bg-slate-800 text-amber-400 font-mono text-2xl px-4 py-1 rounded shadow-inner border border-slate-700">
          {tiempo_jugador}
        </div>
      </div>
    </div>
  );

  
};
