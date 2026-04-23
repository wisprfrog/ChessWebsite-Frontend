"use client";

import NavBar from "@/components/navBar";
import Footer from "@/components/footer";
import { TableroAjedrez } from "@/components/tablero-ajedrez/tableroAjedrez";
import { TableroAjedrezCPU } from "@/components/tablero-ajedrez/tableroAjedrezCPU";
import TableroRepeticion from '@/components/tablero-ajedrez/tableroRepeticion';
import TablaMovimientos from "@/components/tablaMovimientos";

import { usarAutenticar } from "@/hooks/usarAutenticar";

import { useSearchParams } from "next/navigation";
import { useMonsterSocket } from "@/hooks/usarSocketMonster";
import { useEffect, useMemo, useState } from 'react';
import { obtenerMovimientosPartida, obtenerNombrePorId, obtenerUsuariosEnPartida } from '@/services/api';

export default function PaginaPartidaAjedrez() {
  const searchParams = useSearchParams();
  const tipo_partida = searchParams.get('tipo_partida');
  const idPartida = searchParams.get('id_partida');
  const [historialMovimientos, setHistorialMovimientos] = useState<string[]>([]);
  const [cargandoRepeticion, setCargandoRepeticion] = useState(false);
  const [errorRepeticion, setErrorRepeticion] = useState<string | null>(null);
  const [usuarioBlancas, setUsuarioBlancas] = useState<string>();
  const [usuarioNegras, setUsuarioNegras] = useState<string>();
  const [indiceRepeticion, setIndiceRepeticion] = useState(0);
  const [tablaMovimientosVisible, setTablaMovimientosVisible] = useState(true);

  const mostrarTablaMovimientos = (lista_movimientos: string[]) => {
    setHistorialMovimientos(lista_movimientos);
    console.log("Movimientos realizados en la partida mi brother: ", lista_movimientos);
  };

  const toggleTablaMovimientos = (visible: boolean) => {
    setTablaMovimientosVisible(visible);
  }

  useEffect(() => {
    if (tipo_partida !== 'repeticion') return;
    if (!idPartida) {
      setErrorRepeticion('Falta id_partida para cargar la repeticion.');
      setHistorialMovimientos([]);
      return;
    }

    const cargarMovimientos = async () => {
      setCargandoRepeticion(true);
      setErrorRepeticion(null);

      try {
        const movimientos = await obtenerMovimientosPartida(idPartida);
        setHistorialMovimientos(Array.isArray(movimientos) ? movimientos : []);
      } catch (error) {
        setErrorRepeticion('No se pudieron cargar los movimientos de la partida.');
        setHistorialMovimientos([]);
      } finally {
        setCargandoRepeticion(false);
      }

      try{
        const nombres = await obtenerUsuariosEnPartida(idPartida);
        setUsuarioBlancas(await obtenerNombrePorId(nombres[0]));
        setUsuarioNegras(await obtenerNombrePorId(nombres[1]));

        //console.log("Nombres de usuarios en la partida: ", { nombreBlancas, nombreNegras });
        //console.log("ID de usuarios en la partida: ", nombres);
      }catch(error){
        console.error("No se pudieron obtener los nombres de los usuarios en la partida: ", error);
      }
    };

    cargarMovimientos();
  }, [idPartida, tipo_partida]);

  const movimientosRepeticion = useMemo(() => {
    return historialMovimientos;
  }, [historialMovimientos]);

  const movimientosRepeticionVisibles = useMemo(() => {
    if (tipo_partida !== 'repeticion') return historialMovimientos;
    const limite = Math.max(0, Math.min(indiceRepeticion, movimientosRepeticion.length));
    return movimientosRepeticion.slice(0, limite);
  }, [historialMovimientos, indiceRepeticion, movimientosRepeticion, tipo_partida]);

  const { funcionaToken, nombreUsuario } = usarAutenticar();

  function actualizarHistorialMovimientos(lista_movimientos: string[]) {
    setHistorialMovimientos(lista_movimientos);
  }

  const [numSolicitudes, setNumSolicitudes] = useState(0);

  function mostrarSolicitudes(solicitudes: Array<string>) {
    setNumSolicitudes(solicitudes.length);
  }

  useMonsterSocket({ manejarNuevaNotificacion: mostrarSolicitudes });
  
  if(funcionaToken === false || nombreUsuario === null) return null;

  const tableroActual =
    tipo_partida === 'cpu' ? (
      <TableroAjedrezCPU mostrar_tabla_movimientos={actualizarHistorialMovimientos} />
    ) : tipo_partida === 'jugador' ? (
      <TableroAjedrez nombre_jugador={nombreUsuario} manejarVisibilidadTablaMovimientos={toggleTablaMovimientos} mostrar_tabla_movimientos={actualizarHistorialMovimientos} />
    ) : tipo_partida === 'repeticion' ? (
      <TableroRepeticion
        movimientos={movimientosRepeticion}
        nombreBlancas={usuarioBlancas}
        nombreNegras={usuarioNegras}
        orientacion="white"
         onIndiceCambio={setIndiceRepeticion}
      />
    ) : null;
  
  return (
    <main className='flex flex-1 w-screen h-full flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-amber-900 to-blue-950'>
      <NavBar cuantasSolicitudesAmistad={numSolicitudes}/>
      <div className='flex flex-1 w-full h-full justify-center items-center p-6 min-h-0'>
        <div className='flex w-[65%] h-full gap-x-20 overflow-hidden rounded-lg p-5'>
            {tableroActual}
            <div className={`w-4/10 h-full ${tablaMovimientosVisible ? 'block' : 'hidden'}`}>
            <TablaMovimientos lista_movimientos={movimientosRepeticionVisibles}/>
              {cargandoRepeticion ? <p className='text-sm text-emerald-100'>Cargando repeticion...</p> : null}
              {errorRepeticion ? <p className='text-sm text-rose-300'>{errorRepeticion}</p> : null}
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
