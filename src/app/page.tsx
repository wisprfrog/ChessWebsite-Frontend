"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BotonEntrarPartida from "../components/botonEntrarPartida";
import NavBar from "../components/navBar";
import { usarAutenticar } from "../hooks/usarAutenticar";

export default function PaginaInicio() {
  const router = useRouter();
  const { funcionaToken, nombreUsuario } = usarAutenticar();

  if(funcionaToken === false || nombreUsuario === null) return null;

  return (
    <main className="w-full h-full">
      <NavBar />
      <h1>Página de inicio de ajedrez mi bro</h1>

      <BotonEntrarPartida
        tipo_de_partida="jugador"
        nombre_usuario={nombreUsuario}
      />
      <BotonEntrarPartida tipo_de_partida="cpu" />
      
    </main>
  );
}
