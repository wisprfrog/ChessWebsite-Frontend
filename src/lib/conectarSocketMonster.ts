import { io } from "socket.io-client";

const url = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/monster_chess`
  : "http://localhost:4000/monster_chess";

export const socketMonster = io(url, {
  autoConnect: false
});