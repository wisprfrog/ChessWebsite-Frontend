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

      <div className="w-full h-content flex flex-1 flex-col items-start justify-center pl-20 gap-y-15">

      <h1 className="h-content flex flex-col text-center text-5xl font-bold text-emerald-100">¡Bienvenid@, {nombreUsuario}!</h1>

        <div className="h-content flex justify-center gap-20">
          <div className="flex flex-col justify-center gap-20">
            <BotonConIcono
              className="bg-amber-600 px-8 py-8 text-lg text-slate-950 shadow-lg shadow-black/20 hover:bg-amber-500"
              tamanioIcon="h-8 w-8"
              funcion={() => manejarEntrarPartida("jugador")}
              texto="Buscar Partida"
              size="default"
              ruta_icono="/assets/icons/chessKing.svg"
              variant="default"
            />
          </div>

          <div className="flex flex-col justify-center gap-20">
            <BotonConIcono
              className="bg-amber-600 px-8 py-8 text-lg text-slate-950 shadow-lg shadow-black/20 hover:bg-amber-500"
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
