import { useEffect, useRef, useState } from "react";
import { conectarSocketMonster } from "../services/socketMonster.js";

export function useConectarSocketMonster(manejarCargarSolicitudesAmistad: ((solicitudes: Set<string>) => void) | null, manejarRefrescarAmistades: ((solicitudes: Set<string>) => void) | null) {
  const socketRef = useRef<any>(null);
  const [enviarSolicitudAmistad, setEnviarSolicitudAmistad] = useState<((nombre_usuario_destino: string) => void) | null>(null);
  const [aceptarSolicitudAmistad, setAceptarSolicitudAmistad] = useState<((nombre_usuario_destino: string) => void) | null>(null);
  const [rechazarSolicitudAmistad, setRechazarSolicitudAmistad] = useState<((nombre_usuario_destino: string) => void) | null>(null);
  const [eliminarAmigo, setEliminarAmigo] = useState<((nombre_usuario_destino: string) => void) | null>(null);

  useEffect(() => {
    const { nombre_usuario_ls, socket} = conectarSocketMonster();
    socketRef.current = socket;

    socketRef.current?.on('cargar_solicitudes_amistad', (usuario: string, solicitudes: Set<string>) => {
      if(usuario === nombre_usuario_ls) {
        if(manejarCargarSolicitudesAmistad) manejarCargarSolicitudesAmistad(solicitudes);
      }
    });

    socketRef.current?.on('nueva_solicitud_amistad', (nombre_usuario_origen: string, solicitudes: Set<string>) => {
      if(nombre_usuario_origen === nombre_usuario_ls) {
        if(manejarRefrescarAmistades) manejarRefrescarAmistades(solicitudes);
      }
    });

    const emitirSolicitudAmistad = (nombre_usuario_destino: string) => {
      socketRef.current?.emit("enviar_solicitud_amistad", { nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino });
    };

    const emitirAceptarSolicitudAmistad = (nombre_usuario_destino: string) => {
      socketRef.current?.emit("aceptar_solicitud_amistad", { nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino });
    };

    const emitirRechazarSolicitudAmistad = (nombre_usuario_destino: string) => {
      socketRef.current?.emit("rechazar_solicitud_amistad", { nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino });
    };

    const emitirEliminarAmigo = (nombre_usuario_destino: string) => {
      socketRef.current?.emit("eliminar_amigo", { nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino });
    };

    setEnviarSolicitudAmistad(() => emitirSolicitudAmistad);
    setAceptarSolicitudAmistad(() => emitirAceptarSolicitudAmistad);
    setRechazarSolicitudAmistad(() => emitirRechazarSolicitudAmistad);
    setEliminarAmigo(() => emitirEliminarAmigo);

    return () => {
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
    };
  }, []);

  return { enviarSolicitudAmistad, aceptarSolicitudAmistad, rechazarSolicitudAmistad, eliminarAmigo };
};