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
  const [nombreUsuarioLocal, setNombreUsuarioLocal] = useState<string | null>(
    null,
  );

  const { funcionaToken } = usarAutenticar();

  useEffect(() => {
    const nombre_usuario = localStorage.getItem("nombre_usuario");
    setNombreUsuarioLocal(nombre_usuario);
  })

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
    <div className="flex flex-col w-full min-h-screen justify-start items-stretch">
      <NavBar cuantasSolicitudesAmistad={numSolicitudes} />
      <div className="relative flex flex-col md:flex-row w-full flex-1 justify-center items-start p-20 bg-gray-100">
        {/*Contenido*/}
        <div className="flex flex-col w-2/5 h-min-90/100 h-content justify-start items-center gap-5 bg-white p-6 rounded-lg shadow-sm border border-gray-100 ">
          {/*Perfil*/}
          <div className="flex justify-center items-center w-70 h-70 rounded-full bg-gray-500">
            Imagen de mi bro {nombreUsuarioParam}
          </div>
          {nombreUsuarioLocal && nombreUsuarioLocal === nombreUsuarioParam ? (
            <div className="flex flex-col justify-start items-center w-full h-2/5 gap-5">
              <p className="text-center font-bold text-l">
                Usuario: {nombreUsuarioParam}
              </p>
              <div
                className={`grid w-1/2 transition-[grid-template-rows,opacity] duration-500 ease-in-out ${mostrarEditar ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col justify-start items-center h-2/5 gap-5">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
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
                  <p className="text-center">{nombreUsuarioParam}</p>
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

        <div className="flex flex-col w-3/5 h-full ">
          <div className="flex flex-col justify-start items-center gap-5 bg-gray-100 p-6">

            <TablaAmigos
              manejarEnviarSolicitud={emitirEnviarSolicitudAmistad}
              manejarCancelarSolicitud={emitirCancelarSolicitudAmistad}
              manejarAceptarSolicitud={emitirAceptarSolicitudAmistad}
              manejarRechazarSolicitud={emitirRechazarSolicitudAmistad}
              listaSolicitudesEnviadas={solicitudesAmistadEnviadas}
              listaSolicitudesRecibidas={solicitudesAmistadRecibidas}
              nombreUsuario={nombreUsuarioParam}
              mostrarEliminar={puedeEditar}
            />
          </div>
          <div className="flex flex-col justify-start items-center gap-5 bg-gray-100 p-6">
            <TablaHistorial nombreUsuario={nombreUsuarioParam} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
