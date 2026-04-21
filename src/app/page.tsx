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
    <main className="flex min-h-screen w-full flex-col bg-gradient-to-br from-[#020816] via-[#0f172a] to-amber-800">
      <NavBar cuantasSolicitudesAmistad={numSolicitudes} />

      <div className="flex w-full flex-1 flex-col items-center justify-center px-20 py-20 md:py-0 md:items-start md:pl-20 gap-8 md:gap-12">

      <h1 className="text-center md:text-left text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-100">¡Bienvenid@, {nombreUsuario}!</h1>

        <div className="flex flex-col md:flex-row w-full md:w-auto items-center md:justify-start gap-6 md:gap-20 mt-4 mb-8">
          <div className="w-content sm:w-2/3 md:w-auto">
            <BotonConIcono
              className="w-full bg-amber-600 text-base md:text-lg text-slate-950 shadow-lg shadow-black/20 hover:bg-amber-500 flex justify-center"
              tamanioIcon="h-7 w-7 md:h-8 md:w-8"
              funcion={() => manejarEntrarPartida("jugador")}
              texto="Buscar Partida"
              size="default"
              ruta_icono="/assets/icons/chessKing.svg"
              variant="default"
            />
          </div>

          <div className="w-content sm:w-2/3 md:w-auto">
            <BotonConIcono
              className="w-full bg-amber-600 text-base md:text-lg text-slate-950 shadow-lg shadow-black/20 hover:bg-amber-500 flex justify-center"
              tamanioIcon="h-8 w-8"
              funcion={() => manejarEntrarPartida("cpu")}
              texto="Partida contra CPU"
              size="default"
              ruta_icono="/assets/icons/robot.svg"
              variant="default"
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
