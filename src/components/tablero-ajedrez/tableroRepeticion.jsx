"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function TableroRepeticion({
  movimientos = [],
  fenInicial,
  nombreBlancas = "Blancas",
  nombreNegras = "Negras",
  orientacion = "white",
  intervaloMs = 1200,
  onIndiceCambio = () => {},
}) {
  const [indiceActual, setIndiceActual] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const movimientosNormalizados = useMemo(() => {
    if (!Array.isArray(movimientos)) return [];
    return movimientos.filter((m) => typeof m === "string" && m.trim().length > 0);
  }, [movimientos]);

  const posiciones = useMemo(() => {
    const juego = new Chess();
    const fenes = [fenInicial || juego.fen()];

    const convertirUciAMovimiento = (movimiento) => {
      if (typeof movimiento !== "string") return null;
      const valor = movimiento.trim();
      if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(valor)) return null;

      return {
        from: valor.slice(0, 2).toLowerCase(),
        to: valor.slice(2, 4).toLowerCase(),
        promotion: valor.length === 5 ? valor.slice(4, 5).toLowerCase() : undefined,
      };
    };

    if (fenInicial) {
      const cargaOk = juego.load(fenInicial);
      if (!cargaOk) {
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
  const fenActual = posiciones.fenes[Math.min(indiceActual, totalJugadas)] || new Chess().fen();
  const intervaloRef = useRef(null);

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
    if (!reproduciendo) return undefined;
    if (indiceActual >= totalJugadas) {
      setReproduciendo(false);
      return undefined;
    }

    intervaloRef.current = window.setInterval(() => {
      setIndiceActual((prev) => {
        if (prev >= totalJugadas) {
          window.clearInterval(intervaloRef.current);
          setReproduciendo(false);
          return prev;
        }
        return prev + 1;
      });
    }, Math.max(200, intervaloMs));

    return () => {
      if (intervaloRef.current) {
        window.clearInterval(intervaloRef.current);
      }
    };
  }, [indiceActual, intervaloMs, reproduciendo, totalJugadas]);

  const irAlInicio = () => {
    setReproduciendo(false);
    setIndiceActual(0);
  };

  const irAtras = () => {
    setReproduciendo(false);
    setIndiceActual((prev) => Math.max(0, prev - 1));
  };

  const irAdelante = () => {
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

  return (
    <div className="flex w-full mx-0 my-auto gap-x-10">
      <div className="flex flex-col w-full justify-between items-center mb-4 gap-3">
        <div className="flex justify-end w-full">
          <p className="text-sm w-content px-4">{nombreNegras}</p>
        </div>

        <Chessboard options={chessboardOptions} />

        <div className="flex w-full justify-start">
          <p className="text-sm w-content px-4">{nombreBlancas}</p>
        </div>

        <div className="w-full flex flex-col gap-2 px-4">
          <div className="flex gap-2 flex-wrap">
            <button type="button" className="px-3 py-1 bg-gray-200 rounded cursor-pointer" onClick={irAlInicio}>
              |&lt;
            </button>
            <button type="button" className="px-3 py-1 bg-gray-200 rounded cursor-pointer" onClick={irAtras}>
              &lt;
            </button>
            <button type="button" className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer" onClick={alternarReproduccion}>
              {reproduciendo ? "Pausar" : "Reproducir"}
            </button>
            <button type="button" className="px-3 py-1 bg-gray-200 rounded cursor-pointer" onClick={irAdelante}>
              &gt;
            </button>
            <button type="button" className="px-3 py-1 bg-gray-200 rounded cursor-pointer" onClick={irAlFinal}>
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
          />

          <p className="text-sm text-gray-700">
            Jugada {indiceActual} de {totalJugadas}
          </p>

          {mensajeError ? <p className="text-sm text-red-600">{mensajeError}</p> : null}
        </div>
      </div>
    </div>
  );
}