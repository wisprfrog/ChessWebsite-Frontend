"use client";

import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usarAutenticar } from "../../hooks/usarAutenticar";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";

import { useMonsterSocket } from "../../hooks/usarSocketMonster";
import { obtenerListaAmigos, obtenerIdUsuario, eliminarAmigo } from "@/services/api";

// Componente de perfil de usuario
import FormularioEditarNombreUsuario from "../../components/formularioEditarNombre";
import FormularioEditarContrasena from "../../components/formularioEditarContrasena";
import TablaEstadisticas from "@/components/tablaEstadisticas";
import BotonConIcono from "@/components/boton";

// Historial
import TablaHistorial from "../../components/tablaHistorial";
import TablaAmigos from "@/components/tablaAmigos";

export default function Perfil() {
  const searchParams = useSearchParams();
  const nombreUsuarioParam = searchParams.get("usuario");
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [nombreUsuarioLocal, setNombreUsuarioLocal] = useState<string | null>(null);

  const { funcionaToken } = usarAutenticar();

  useEffect(() => {
    const nombre_usuario = localStorage.getItem("nombre_usuario");
    setNombreUsuarioLocal(nombre_usuario);
  }, []);

  useEffect(() => {
    const actualizarNombreUsuario = () => {
      setNombreUsuarioLocal(localStorage.getItem("nombre_usuario"));
    };

    actualizarNombreUsuario();
    window.addEventListener("storage", actualizarNombreUsuario);
    window.addEventListener(
      "nombre-usuario-actualizado",
      actualizarNombreUsuario,
    );

    return () => {
      window.removeEventListener("storage", actualizarNombreUsuario);
      window.removeEventListener(
        "nombre-usuario-actualizado",
        actualizarNombreUsuario,
      );
    };
  }, []);

  useEffect(() => {
    setMostrarEditar(false);
    setMostrarEliminar(false);
  }, [nombreUsuarioParam]);

  const puedeEditar = nombreUsuarioParam === nombreUsuarioLocal;

  const [numSolicitudes, setNumSolicitudes] = useState(0);

  const [solicitudesAmistadRecibidas, setSolicitudesAmistadRecibidas] = useState<Array<string>>([]);
  const [solicitudesAmistadEnviadas, setSolicitudesAmistadEnviadas] = useState<Array<string>>([]);
  const [actualizarTabla, setActualizarTabla] = useState(0);

  async function manejarEliminarAmigo() {
    const id_usuario_ls = await obtenerIdUsuario(nombreUsuarioLocal ?? undefined);
    const id_usuario_param = await obtenerIdUsuario(nombreUsuarioParam ?? undefined);

    eliminarAmigo(localStorage.getItem("token"), id_usuario_ls, id_usuario_param).then(() => {
      setEsAmigo(false);
      setActualizarTabla(prev => prev + 1);
    });
  }

  function mostrarSolicitudes(solicitudes: Array<string>) {
    setNumSolicitudes(solicitudes.length);
  }

  function cargarSolicitudes(solicitudes: Array<string>) {
    setSolicitudesAmistadRecibidas(solicitudes);
  }

  function cargarSolicitudesEnviadas(solicitudes: Array<string>) {
    setSolicitudesAmistadEnviadas(solicitudes);
  }

  const {
    emitirAceptarSolicitudAmistad,
    emitirRechazarSolicitudAmistad,
    emitirEnviarSolicitudAmistad,
    emitirCancelarSolicitudAmistad,
    emitirEnviarInvitacionPartida,
  } = useMonsterSocket({
    manejarNuevaNotificacion: mostrarSolicitudes,
    manejarCargarSolicitudesAmistad: cargarSolicitudes,
    manejarCargarSolicitudesEnviadas: cargarSolicitudesEnviadas,
  });

  const [esAmigo, setEsAmigo] = useState(false);

  async function cargarListaAmigos() {
    const id_usuario_ls = await obtenerIdUsuario(nombreUsuarioLocal);
    const amigos = await obtenerListaAmigos(id_usuario_ls);
    const id_usuario_param = await obtenerIdUsuario(nombreUsuarioParam ?? undefined);

    if(amigos.map((amigo : {id: number, nombre_usuario : string}) => amigo.id).includes(id_usuario_param)) {
      setEsAmigo(true);
    }
  }

  useEffect(() => {
    if(nombreUsuarioLocal && nombreUsuarioParam) {
      cargarListaAmigos();
    }
  }, [nombreUsuarioLocal, nombreUsuarioParam]);

  if (
    funcionaToken === null ||
    nombreUsuarioLocal === null ||
    nombreUsuarioParam === null
  )
    return null;

  return (
    <div className="flex min-h-screen w-full flex-col items-stretch justify-start bg-gradient-to-br from-slate-950 via-amber-900 to-blue-950">
      <NavBar cuantasSolicitudesAmistad={numSolicitudes} />
      <div className="relative flex w-full flex-1 flex-col items-start justify-center p-20 md:flex-row">
        {/*Contenido*/}
        <div className="h-content h-min-90/100 flex w-2/5 flex-col items-center justify-start gap-5 rounded-lg border border-sky-900/60 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
          {/*Perfil*/}
          <div className="flex h-70 w-70 items-center justify-center rounded-full bg-slate-800 text-amber-100">
            Imagen de mi bro {nombreUsuarioParam}
          </div>
          {nombreUsuarioLocal && nombreUsuarioLocal === nombreUsuarioParam ? (
            <div className="flex flex-col justify-start items-center w-full h-2/5 gap-5">
              <p className="text-l text-center font-bold text-amber-100">
                Usuario: {nombreUsuarioParam}
              </p>
              <div
                className={`grid w-1/2 transition-[grid-template-rows,opacity] duration-500 ease-in-out ${mostrarEditar ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col justify-start items-center h-2/5 gap-5">
                    <button
                      className="mt-4 cursor-pointer rounded bg-amber-500 px-4 py-2 text-slate-950 hover:bg-amber-400"
                      onClick={() => setMostrarEditar(true)}
                    >
                      Editar Perfil
                    </button>
                    <TablaEstadisticas nombreUsuario={nombreUsuarioParam} />
                  </div>
                </div>
              </div>
              <div
                className={`grid w-full transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${mostrarEditar ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0 mt-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-15">
                    <FormularioEditarContrasena
                      manejarVolver={() => setMostrarEditar(false)}
                    />
                    <FormularioEditarNombreUsuario
                      manejarVolver={() => setMostrarEditar(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col justify-start items-center w-1/2 h-2/5 gap-5">
                <div className="flex gap-x-5 items-center">
                  <p className="text-center text-amber-100">{nombreUsuarioParam}</p>
                  {
                    solicitudesAmistadEnviadas.includes(nombreUsuarioParam) ? (
                        <BotonConIcono
                        variant="pendiente"
                        texto="Cancelar solicitud de amistad"
                        ruta_icono="/assets/icons/pendiente.svg"
                        funcion={() => emitirCancelarSolicitudAmistad(nombreUsuarioParam)}
                        className="flex-row-reverse text-orange-500"
                        tamanioIcon="h-6 w-6"
                      />
                    )
                    : esAmigo ? (
                      <BotonConIcono
                        variant="destructive"
                        texto="Eliminar amigo"
                        ruta_icono="/assets/icons/eliminar.svg"
                        funcion={() => manejarEliminarAmigo()}
                        className="flex-row-reverse text-red-500"
                        tamanioIcon="h-6 w-6"
                      />
                    )
                    :
                    (
                      <BotonConIcono
                        variant="agregar"
                        texto="Enviar solicitud de amistad"
                        ruta_icono="/assets/icons/agregar.svg"
                        funcion={() => emitirEnviarSolicitudAmistad(nombreUsuarioParam)}
                        className="flex-row-reverse text-green-500"
                        tamanioIcon="h-6 w-6"
                      />
                    )
                  }
                </div>
                <TablaEstadisticas nombreUsuario={nombreUsuarioParam} />
              </div>
            </>
          )}
        </div>

        <div className="flex h-full w-3/5 flex-col">
          <div className="flex flex-col items-center justify-start gap-5 p-3">

            <TablaAmigos
              manejarEnviarSolicitud={emitirEnviarSolicitudAmistad}
              manejarCancelarSolicitud={emitirCancelarSolicitudAmistad}
              manejarAceptarSolicitud={emitirAceptarSolicitudAmistad}
              manejarRechazarSolicitud={emitirRechazarSolicitudAmistad}
              manejarEnviarInvitacionPartida={emitirEnviarInvitacionPartida}
              listaSolicitudesEnviadas={solicitudesAmistadEnviadas}
              listaSolicitudesRecibidas={solicitudesAmistadRecibidas}
              nombreUsuario={nombreUsuarioParam}
              mostrarEliminar={puedeEditar}
            />
          </div>
          <div className="flex flex-col items-center justify-start gap-5 p-3">
            <TablaHistorial nombreUsuario={nombreUsuarioParam} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
