import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketMonsterProvider";
import { useRouter } from "next/navigation";

type SocketHandlers = {
  manejarNuevaNotificacion?: ((solicitudes: Array<string>) => void) | null;
  manejarCargarSolicitudesAmistad?: ((solicitudes: Array<string>) => void) | null;
  manejarCargarSolicitudesEnviadas?: ((solicitudes: Array<string>) => void) | null;
  manejarCargarInvitacionesPartida?: ((invitaciones: Array<string>) => void) | null;
  manejarCargarInvitacionesPartidaEnviadas?: ((invitaciones: Array<string>) => void) | null;
  manejarNuevaInvitacionPartida?: ((invitaciones: Array<string>) => void) | null;
};


export function useMonsterSocket(handlers: SocketHandlers = {}) {
  const socket = useContext(SocketContext);
  const router = useRouter();

  const [nombre_usuario_ls, setNombre_usuario_ls] = useState<string | null>(null);

  useEffect(() => {
    const nombre_usuario_actual = localStorage.getItem("nombre_usuario");
    setNombre_usuario_ls(nombre_usuario_actual);
  }, [socket]);

  useEffect(() => {
    if (socket && nombre_usuario_ls){
      socket.emit("pedir_solicitudes_amistad", { nombre_usuario: nombre_usuario_ls });
      socket.emit("pedir_solicitudes_amistad_enviadas", { nombre_usuario: nombre_usuario_ls });
      socket.emit("pedir_invitaciones_partida", { nombre_usuario: nombre_usuario_ls });
      socket.emit("pedir_invitaciones_partida_enviadas", { nombre_usuario: nombre_usuario_ls });
    }
  }, [nombre_usuario_ls]);

  useEffect(() => {
    if (!socket || !nombre_usuario_ls) return;

    socket.on("nueva_solicitud_amistad", ({ nombre_usuario_destino, solicitudes }) => {
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
      if (nombre_usuario_destino === nombre_usuario_ls) {
        if (handlers.manejarCargarSolicitudesEnviadas) {
          handlers.manejarCargarSolicitudesEnviadas(solicitudes);
        }
      }
    });

    ///INvitaciones de partida
    socket.on('cargar_invitaciones_partida', ({ nombre_usuario_destino, invitaciones }) => {
      if (nombre_usuario_destino === nombre_usuario_ls && handlers.manejarCargarInvitacionesPartida) {
        handlers.manejarCargarInvitacionesPartida(invitaciones);
      }
    });

    socket.on('cargar_invitaciones_enviadas', ({ nombre_usuario_destino, invitaciones }) => {
      if (handlers.manejarCargarInvitacionesPartidaEnviadas) {
        handlers.manejarCargarInvitacionesPartidaEnviadas(invitaciones);
      }
    });

    socket.on('nueva_invitacion_partida', ({ nombre_usuario_destino, invitaciones }) => {
      if (nombre_usuario_destino === nombre_usuario_ls && handlers.manejarNuevaInvitacionPartida) {
        handlers.manejarNuevaInvitacionPartida(invitaciones);
      }
    });

    socket.on('invitacion_partida_aceptada', ({ nombre_usuario_origen, nombre_usuario_destino, partida }) => {
    });

    socket.on('invitacion_partida_rechazada', ({ nombre_usuario_origen, nombre_usuario_destino }) => {
    });
    
    socket.on('invitacion_partida_aceptada', ({nombre_usuario_origen, nombre_usuario_destino, sala_asignada}) => {
      if(nombre_usuario_origen === nombre_usuario_ls || nombre_usuario_destino === nombre_usuario_ls) {
        localStorage.setItem("sala_partida_amigos", sala_asignada);
        router.push('/partida_ajedrez?tipo_partida=jugador');
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

      socket.off('cargar_solicitudes_amistad_enviadas', ({ nombre_usuario_destino, solicitudes }) => {
        if(nombre_usuario_destino === nombre_usuario_ls) {
          if(handlers.manejarCargarSolicitudesEnviadas) {
            handlers.manejarCargarSolicitudesEnviadas(solicitudes);
          }
        }
      });

      socket.off('cargar_invitaciones_partida', ({ nombre_usuario_destino, invitaciones }) => {
        if (handlers.manejarCargarInvitacionesPartida) {
          handlers.manejarCargarInvitacionesPartida(invitaciones);
        }
      });

      socket.off('cargar_invitaciones_enviadas', ({ nombre_usuario_destino, invitaciones }) => {
        if (handlers.manejarCargarInvitacionesPartidaEnviadas) {
          handlers.manejarCargarInvitacionesPartidaEnviadas(invitaciones);
        }
      });

      socket.off('nueva_invitacion_partida', ({ nombre_usuario_destino, invitaciones }) => {
        if (handlers.manejarNuevaInvitacionPartida) {
          handlers.manejarNuevaInvitacionPartida(invitaciones);
        }
      });
      

    }
  }, [socket, nombre_usuario_ls]);
  
  const emitirAceptarSolicitudAmistad = (nombre_usuario_destino : string) => {
    socket?.emit("aceptar_solicitud_amistad", { nombre_usuario1: nombre_usuario_ls, nombre_usuario2: nombre_usuario_destino });
  };

  const emitirRechazarSolicitudAmistad = (nombre_usuario_destino : string) => {
    socket?.emit("rechazar_solicitud_amistad", ({ nombre_usuario1: nombre_usuario_ls, nombre_usuario2: nombre_usuario_destino }));
  };

  const emitirEnviarSolicitudAmistad = (nombre_usuario_destino : string) => {
    socket?.emit("enviar_solicitud_amistad", ({ nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino: nombre_usuario_destino }));
  };

  const emitirCancelarSolicitudAmistad = (nombre_usuario_destino : string) => {
    socket?.emit("cancelar_solicitud_amistad", ({ nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino: nombre_usuario_destino }));
  }


  //invitaciones a partida
  const emitirEnviarInvitacionPartida = (nombre_usuario_destino : string) => {
    socket?.emit("invitar_a_partida", ({ nombre_usuario_origen: nombre_usuario_ls, nombre_usuario_destino: nombre_usuario_destino }));
  }

  const emitirAceptarInvitacionPartida = (nombre_usuario_origen : string) => {
    socket?.emit("aceptar_invitacion_partida", ({ nombre_usuario_origen: nombre_usuario_origen, nombre_usuario_destino: nombre_usuario_ls }));
  }

  const emitirRechazarInvitacionPartida = (nombre_usuario_origen : string) => {
    socket?.emit("rechazar_invitacion_partida", ({ nombre_usuario_origen: nombre_usuario_origen, nombre_usuario_destino: nombre_usuario_ls }));
  }

  
  return { emitirAceptarSolicitudAmistad, emitirRechazarSolicitudAmistad, emitirEnviarSolicitudAmistad, emitirCancelarSolicitudAmistad, emitirEnviarInvitacionPartida, emitirAceptarInvitacionPartida, emitirRechazarInvitacionPartida };
}