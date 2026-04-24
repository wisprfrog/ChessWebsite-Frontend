"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useRouter } from "next/navigation";

export default function TableroRepeticion({
  movimientos = [] as Array<string>,
  fenInicial = "" as string,
  nombreBlancas = "" as string,
  nombreNegras = "" as string,
  orientacion = "white" as "white" | "black",
  intervaloMs = 1200,
  onIndiceCambio = (indice: number) => {},
}) {
  const [indiceActual, setIndiceActual] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const router = useRouter();

  const movimientosNormalizados = useMemo(() => {
    if (!Array.isArray(movimientos)) return [];
    return movimientos.filter(
      (m) => typeof m === "string" && m.trim().length > 0,
    );
  }, [movimientos]);

  const posiciones = useMemo(() => {
    const juego = new Chess();
    const fenes = [fenInicial || juego.fen()];

    const convertirUciAMovimiento = (movimiento: string) => {
      if (typeof movimiento !== "string") return null;
      const valor = movimiento.trim();
      if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(valor)) return null;

      return {
        from: valor.slice(0, 2).toLowerCase(),
        to: valor.slice(2, 4).toLowerCase(),
        promotion:
          valor.length === 5 ? valor.slice(4, 5).toLowerCase() : undefined,
      };
    };

    if (fenInicial) {
      try {
        juego.load(fenInicial);
      } catch (error) {
        return {
          fenes: [new Chess().fen()],
          error: "FEN inicial invalido. Se usa posicion inicial por defecto.",
        };
      }

      fenes[0] = juego.fen();
    }

    for (let i = 0; i < movimientosNormalizados.length; i += 1) {
      const movimiento = movimientosNormalizados[i];
      const resultado =
        juego.move(movimiento, { strict: false }) ||
        (() => {
          const movimientoUci = convertirUciAMovimiento(movimiento);
          return movimientoUci ? juego.move(movimientoUci) : null;
        })();

      if (!resultado) {
        return {
          fenes,
          error: `Movimiento invalido en la jugada ${i + 1}: ${movimiento}`,
        };
      }

      fenes.push(juego.fen());
    }

    return { fenes, error: "" };
  }, [fenInicial, movimientosNormalizados]);

  const totalJugadas = posiciones.fenes.length - 1;
  const fenActual =
    posiciones.fenes[Math.min(indiceActual, totalJugadas)] || new Chess().fen();
  const intervaloRef = useRef<number | null>(null);
  const [usuarioActual, setUsuarioActual] = useState("");

  const chessboardOptions = {
    position: fenActual,
    boardOrientation: orientacion,
    arePiecesDraggable: false,
    id: "repeticion-partida",
  };

  useEffect(() => {
    setMensajeError(posiciones.error);
    setIndiceActual((prev) => Math.min(prev, totalJugadas));
  }, [posiciones.error, totalJugadas]);

  useEffect(() => {
    onIndiceCambio(indiceActual);
  }, [indiceActual, onIndiceCambio]);

  useEffect(() => {
    setUsuarioActual(localStorage.getItem("nombre_usuario") || "");
  }, []);

  const nombreBlancasMostrado =
    usuarioActual && usuarioActual === nombreBlancas ? "Tú" : nombreBlancas;
  const nombreNegrasMostrado =
    usuarioActual && usuarioActual === nombreNegras ? "Tú" : nombreNegras;
  const claseBaseNombreJugador = "`text-sm md:text-base lg:text-lg font-bold text-white truncate transition-colors duration-200";
  const claseNombreBlancas = `${claseBaseNombreJugador} ${
    nombreBlancasMostrado === "Tú"
      ? ""
      : "underline onMouseover:text-gray-300 cursor-pointer"
  }`;
  const claseNombreNegras = `${claseBaseNombreJugador} ${
    nombreNegrasMostrado === "Tú"
      ? ""
      : "hover:text-amber-400 hover:underline cursor-pointer"
  }`;

  useEffect(() => {
    if (!reproduciendo) {
      return undefined;
    }

    if (indiceActual >= totalJugadas) {
      setReproduciendo(false);
      return undefined;
    }

    if (intervaloRef.current !== null) {
      window.clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    const duracionIntervalo = Math.max(1200, Number(intervaloMs) || 1200);

    intervaloRef.current = window.setInterval(() => {
      setIndiceActual((prev) => {
        if (prev >= totalJugadas) {
          if (intervaloRef.current !== null) {
            window.clearInterval(intervaloRef.current);
            intervaloRef.current = null;
          }
          setReproduciendo(false);
          return prev;
        }

        return prev + 1;
      });
    }, duracionIntervalo);

    return () => {
      if (intervaloRef.current !== null) {
        window.clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    };
  }, [reproduciendo, indiceActual, intervaloMs, totalJugadas]);

  const irAlInicio = () => {
    setReproduciendo(false);
    setIndiceActual(0);
  };

  const irAtras = () => {
    setReproduciendo(false);
    setIndiceActual((prev) => Math.max(0, prev - 1));
  };

  const irAdelante = () => {
    setReproduciendo(false);
    setIndiceActual((prev) => Math.min(totalJugadas, prev + 1));
  };

  const irAlFinal = () => {
    setReproduciendo(false);
    setIndiceActual(totalJugadas);
  };

  const alternarReproduccion = () => {
    if (indiceActual >= totalJugadas) {
      setIndiceActual(0);
    }
    setReproduciendo((prev) => !prev);
  };

  const redirigirAPerfilUsuario = (nombreUsuario: string) => {
    if (!nombreUsuario || nombreUsuario === "Tú") return;
    router.push(`/perfil?usuario=${nombreUsuario}`);
  };

  return (
    // Contenedor principal idéntico a tableroAjedrez.tsx y CPU
    <div className="flex flex-col flex-1 w-full min-w-0 min-h-0 justify-center items-center lg:mr-8">
      <style>{`
        input[type="range"] {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #1e293b;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d27d0c;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ba610e;
          cursor: pointer;
          border: none;
        }
      `}</style>
      
      {/* Contenedor estricto para el ancho máximo (El "Punto Dulce") */}
      <div className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[400px] xl:max-w-[440px] flex flex-col items-center">
        
        {/* Nombre Negras */}
        <div className="flex justify-end w-full mb-1 lg:mb-2">
          <p
            onClick={() => redirigirAPerfilUsuario(nombreNegras)}
            className={`text-sm md:text-base lg:text-lg font-bold text-white truncate transition-colors duration-200 ${
              nombreNegrasMostrado !== "Tú"
                ? "hover:text-amber-400 hover:underline cursor-pointer"
                : ""
            }`}
          >
            {nombreNegrasMostrado}
          </p>
        </div>

        {/* TABLERO INFALIBLE */}
        <div className="w-full drop-shadow-2xl">
          <Chessboard options={chessboardOptions} />
        </div>

        {/* Nombre Blancas */}
        <div className="flex w-full justify-start mt-1 lg:mt-2">
          <p
            onClick={() => redirigirAPerfilUsuario(nombreBlancas)}
            className={`text-sm md:text-base lg:text-lg font-bold text-white truncate transition-colors duration-200 ${
              nombreBlancasMostrado !== "Tú"
                ? "hover:text-amber-400 hover:underline cursor-pointer"
                : ""
            }`}
          >
            {nombreBlancasMostrado}
          </p>
        </div>

        {/* Controles de reproducción */}
        <div className="w-full flex flex-col gap-2 mt-3">
          <div className="flex gap-1 sm:gap-2 flex-wrap justify-center lg:justify-between">
            <button
              type="button"
              className="px-3 py-1 text-xs sm:text-sm bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 transition"
              onClick={irAlInicio}
            >
              |&lt;
            </button>
            <button
              type="button"
              className="px-3 py-1 text-xs sm:text-sm bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 transition"
              onClick={irAtras}
            >
              &lt;
            </button>
            <button
              type="button"
              className="flex-1 min-w-[80px] py-1 text-xs sm:text-sm bg-amber-600 text-white font-bold rounded cursor-pointer hover:bg-amber-500 transition shadow-lg"
              onClick={alternarReproduccion}
            >
              {reproduciendo ? "Pausar" : "Reproducir"}
            </button>
            <button
              type="button"
              className="px-3 py-1 text-xs sm:text-sm bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 transition"
              onClick={irAdelante}
            >
              &gt;
            </button>
            <button
              type="button"
              className="px-3 py-1 text-xs sm:text-sm bg-slate-700 text-white rounded cursor-pointer hover:bg-slate-600 transition"
              onClick={irAlFinal}
            >
              &gt;|
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(0, totalJugadas)}
            value={indiceActual}
            onChange={(e) => {
              setReproduciendo(false);
              setIndiceActual(Number(e.target.value));
            }}
            className="w-full mt-2"
          />

          <p className="text-xs sm:text-sm text-slate-300 font-mono text-center">
            Jugada {indiceActual} de {totalJugadas}
          </p>

          {mensajeError ? (
            <p className="text-xs sm:text-sm text-red-400 bg-red-900/20 p-2 rounded text-center">
              {mensajeError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
