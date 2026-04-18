"use client";

import { createContext, useEffect } from "react";
import { socketMonster } from "../lib/conectarSocketMonster";

export const SocketContext = createContext(socketMonster);

export const SocketProvider = ({ children } : { children: React.ReactNode }) => {
  useEffect(() => {
    const nombre_usuario = localStorage.getItem("nombre_usuario");

    if (!nombre_usuario) return;

    socketMonster.auth = {
      nombre_usuario_actual: nombre_usuario
    };

    socketMonster.connect();

    socketMonster.on("disconnect", () => {
      console.log("Desconectado del servidor de Monster Chess");
    });
  
    return () => {
      socketMonster.removeAllListeners();
      socketMonster.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketMonster}>
      {children}
    </SocketContext.Provider>
  );
};