import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketMonsterProvider";

type SocketHandlers = {
  manejarNuevaNotificacion?: ((solicitudes: Array<string>) => void) | null;
  manejarCargarSolicitudesAmistad?: ((solicitudes: Array<string>) => void) | null;
  manejarCargarSolicitudesEnviadas?: ((solicitudes: Array<string>) => void) | null;
};

export function useMonsterSocket(handlers: SocketHandlers = {}) {
  const socket = useContext(SocketContext);

  const [nombre_usuario_ls, setNombre_usuario_ls] = useState<string | null>(null);

  useEffect(() => {
    const nombre_usuario_actual = localStorage.getItem("nombre_usuario");
    setNombre_usuario_ls(nombre_usuario_actual);
  }, [socket]);

  useEffect(() => {
    if (socket && nombre_usuario_ls){
      socket.emit("pedir_solicitudes_amistad", { nombre_usuario: nombre_usuario_ls });
      socket.emit("pedir_solicitudes_amistad_enviadas", { nombre_usuario: nombre_usuario_ls });
    }
  }, [nombre_usuario_ls]);

  useEffect(() => {
    if (!socket || !nombre_usuario_ls) return;

    socket.on("nueva_solicitud_amistad", ({ nombre_usuario_destino, solicitudes }) => {
      console.log("Recibida nueva solicitud de amistad de:", nombre_usuario_destino, "con solicitudes:", solicitudes);
      if(nombre_usuario_destino === nombre_usuario_ls) {
        if(handlers.manejarNuevaNotificacion){
          handlers.manejarNuevaNotificacion(solicitudes);
        }
        if(handlers.manejarCargarSolicitudesAmistad) {
          handlers.manejarCargarSolicitudesAmistad(solicitudes);
        }
      }
    });

    socket.on('solicitud_amistad_aceptada', ({ nombre_usuario1, nombre_usuario2 }) => {
        //notificacion
        
    });

    socket.on('solicitud_amistad_rechazada', ({ nombre_usuario1, nombre_usuario2 }) => {
        //notificacion
    });

    socket.on('cargar_solicitudes_amistad', ({ nombre_usuario_destino, solicitudes }) => {
      console.log("Recibidas solicitudes de amistad para:", nombre_usuario_destino, "con solicitudes:", solicitudes);
      if (nombre_usuario_destino === nombre_usuario_ls) {
        if (handlers.manejarNuevaNotificacion) {
          handlers.manejarNuevaNotificacion(solicitudes);
        }
        if (handlers.manejarCargarSolicitudesAmistad) {
          handlers.manejarCargarSolicitudesAmistad(solicitudes);
        }
      }
    });

    socket.on('cargar_solicitudes_amistad_enviadas', ({ nombre_usuario_destino, solicitudes }) => {
      console.log("Recibidas solicitudes de amistad enviadas para:", nombre_usuario_destino, "con solicitudes:", solicitudes);
      if (nombre_usuario_destino === nombre_usuario_ls) {
        if (handlers.manejarCargarSolicitudesEnviadas) {
          handlers.manejarCargarSolicitudesEnviadas(solicitudes);
        }
      }
    });

    return () => {
      socket.off("nueva_solicitud_amistad", ({ nombre_usuario_destino, solicitudes }) => {
        if(nombre_usuario_destino === nombre_usuario_ls) {
          if(handlers.manejarNuevaNotificacion){
            handlers.manejarNuevaNotificacion(solicitudes);
          }
          if(handlers.manejarCargarSolicitudesAmistad) {
            handlers.manejarCargarSolicitudesAmistad(solicitudes);
          }
        }
      });

      socket.off('cargar_solicitudes_amistad', ({ nombre_usuario_destino, solicitudes }) => {
        if(nombre_usuario_destino === nombre_usuario_ls) {
          if(handlers.manejarNuevaNotificacion){
            handlers.manejarNuevaNotificacion(solicitudes);
          }
          if(handlers.manejarCargarSolicitudesAmistad) {
            handlers.manejarCargarSolicitudesAmistad(solicitudes);
          }
        }
      }); 
    }
  }, [socket, nombre_usuario_ls]);
  
  const emitirAceptarSolicitudAmistad = (nombre_usuario_destino : string) => {
    console.log("Emitiendo aceptar solicitud de amistad para:", nombre_usuario_destino);
    socket?.emit("aceptar_solicitud_amistad", { nombre_usuario1: nombre_usuario_ls, nombre_usuario2: nombre_usuario_destino });
  };

  const emitirRechazarSolicitudAmistad = (nombre_usuario_destino : string) => {
    console.log("Emitiendo rechazar solicitud de amistad para:", nombre_usuario_destino);
    socket?.emit("rechazar_solicitud_amistad", { nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino: nombre_usuario_destino });
  };

  const emitirEnviarSolicitudAmistad = (nombre_usuario_destino : string) => {
    console.log("Emitiendo enviar solicitud de amistad para:", nombre_usuario_destino, "desde:", nombre_usuario_ls);
    socket?.emit("enviar_solicitud_amistad", ({ nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino: nombre_usuario_destino }));
  };

  const emitirCancelarSolicitudAmistad = (nombre_usuario_destino : string) => {
    console.log("Emitiendo cancelar solicitud de amistad para:", nombre_usuario_destino, "desde:", nombre_usuario_ls);
    socket?.emit("cancelar_solicitud_amistad", ({ nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino: nombre_usuario_destino }));
  }

  return { emitirAceptarSolicitudAmistad, emitirRechazarSolicitudAmistad, emitirEnviarSolicitudAmistad, emitirCancelarSolicitudAmistad };
}