import { io } from "socket.io-client";

const url = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/monster_chess`
  : "http://localhost:4000/monster_chess";

export const conectarSocketMonster = () => {
  const nombre_usuario_ls = localStorage.getItem("nombre_usuario");
  const socketMonster = io(url, {
    auth: {
      nombre_usuario_actual: nombre_usuario_ls
    }
  });

  socketMonster.on("connect", () => {
    console.log("Conectado al servidor de Monster Chess", nombre_usuario_ls);
  });

  socketMonster.on("disconnect", () => {
    console.log("Desconectado del servidor de Monster Chess");
  });

  return { nombre_usuario_ls, socket: socketMonster };
};