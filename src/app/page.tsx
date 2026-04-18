"use client";

import { useRouter } from "next/navigation";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import BotonConIcono from "../components/boton";
import { usarAutenticar } from "../hooks/usarAutenticar";
import { useState } from "react";
import { useMonsterSocket } from "../hooks/usarSocketMonster";

export default function PaginaInicio() {
  const router = useRouter();
  const { funcionaToken, nombreUsuario } = usarAutenticar();

  function manejarEntrarPartida(tipo_partida: string) {
    router.push(`./partida_ajedrez?tipo_partida=${tipo_partida}`);
  }

  const [numSolicitudes, setNumSolicitudes] = useState(0);

  function mostrarSolicitudes(solicitudes: Array<string>) {
    setNumSolicitudes(solicitudes.length);
  }

  useMonsterSocket({ manejarNuevaNotificacion: mostrarSolicitudes });
  
  if (funcionaToken === false || nombreUsuario === null) return null;
  

  return (
    <main className="flex min-h-screen w-full flex-col bg-gray-100">
      <NavBar cuantasSolicitudesAmistad={numSolicitudes} />

      <div className="w-full flex-1">

      <h1 className="flex flex-col text-center text-5xl font-bold mt-30 mb-16">¡Bienvenid@, {nombreUsuario}!</h1>

        <div className="flex justify-center mt-25 gap-20">
          <div className="flex flex-col justify-center gap-20">
            <BotonConIcono
              className="text-xl px-10 py-10 bg-green-700 text-white hover:bg-green-600"
              tamanioIcon="h-10 w-10"
              funcion={() => manejarEntrarPartida("jugador")}
              texto="Buscar Partida"
              size="default"
              ruta_icono="/assets/icons/chessKing.svg"
              variant="outline"
            />
          </div>

          <div className="flex flex-col justify-center gap-20">
            <BotonConIcono
              className="text-xl px-10 py-10 bg-green-700 text-white hover:bg-green-600"
              tamanioIcon="h-10 w-10"
              funcion={() => manejarEntrarPartida("cpu")}
              texto="Partida contra CPU"
              size="default"
              ruta_icono="/assets/icons/robot.svg"
              variant="outline"
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
