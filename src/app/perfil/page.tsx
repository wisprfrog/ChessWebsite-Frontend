"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usarAutenticar } from "../../hooks/usarAutenticar";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";

import { useMonsterSocket } from "../../hooks/usarSocketMonster";
import { obtenerListaAmigos, obtenerIdUsuario, eliminarAmigo, obtenerFotoPerfilUsuario, cambiarFotoPerfilUsuario } from "@/services/api";

// Componente de perfil de usuario
import FormularioEditarNombreUsuario from "../../components/formularioEditarNombre";
import FormularioEditarContrasena from "../../components/formularioEditarContrasena";
import TablaEstadisticas from "@/components/tablaEstadisticas";
import BotonConIcono from "@/components/boton";
import FormularioSubirImagen, { subirACloudinary } from "@/components/formularioSubirImagen";

// Historial
import TablaHistorial from "../../components/tablaHistorial";
import TablaAmigos from "@/components/tablaAmigos";

export default function Perfil() {
  type MensajeFotoPerfil = {
    tipo: "success" | "error" | "info";
    texto: string;
  };

  const DEMORA_MENSAJE_FOTO_MS = 5000;

  const searchParams = useSearchParams();
  const nombreUsuarioParam = searchParams.get("usuario");
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [nombreUsuarioLocal, setNombreUsuarioLocal] = useState<string | null>(null);
  const [fotoPerfilUsuario, setFotoPerfilUsuario] = useState<string | null>(null);
  const [cargandoFoto, setCargandoFoto] = useState(false);
  const [archivoFotoNuevo, setArchivoFotoNuevo] = useState<File | null>(null);
  const [eliminarFotoPerfil, setEliminarFotoPerfil] = useState(false);
  const [guardandoFoto, setGuardandoFoto] = useState(false);
  const [reinicioFormularioFoto, setReinicioFormularioFoto] = useState(0);
  const [mensajeFotoPerfil, setMensajeFotoPerfil] =
    useState<MensajeFotoPerfil | null>(null);

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
    setArchivoFotoNuevo(null);
    setEliminarFotoPerfil(false);
    setMensajeFotoPerfil(null);
  }, [nombreUsuarioParam]);

  useEffect(() => {
    if (!mensajeFotoPerfil) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMensajeFotoPerfil(null);
    }, DEMORA_MENSAJE_FOTO_MS);

    return () => window.clearTimeout(timeoutId);
  }, [mensajeFotoPerfil]);

  useEffect(() => {
    const cargarFotoPerfil = async () => {
      if (!nombreUsuarioParam) {
        setFotoPerfilUsuario(null);
        return;
      }

      setCargandoFoto(true);
      const fotoUrl = await obtenerFotoPerfilUsuario(nombreUsuarioParam);
      setFotoPerfilUsuario(fotoUrl);
      setCargandoFoto(false);
    };

    cargarFotoPerfil();
  }, [nombreUsuarioParam]);

  const puedeEditar = nombreUsuarioParam === nombreUsuarioLocal;
  const hayCambiosFotoPendientes = eliminarFotoPerfil || Boolean(archivoFotoNuevo);
  const tieneFotoGuardada = Boolean(fotoPerfilUsuario);
  const botonLimpiarFotoDeshabilitado =
    guardandoFoto || (!archivoFotoNuevo && (!tieneFotoGuardada || eliminarFotoPerfil));

  const manejarGuardarFotoPerfil = async () => {
    if (!nombreUsuarioLocal || guardandoFoto) {
      return;
    }

    if (!eliminarFotoPerfil && !archivoFotoNuevo) {
      return;
    }

    setGuardandoFoto(true);

    try {
      let nuevaUrlFoto: string | null = null;

      if (!eliminarFotoPerfil && archivoFotoNuevo) {
        nuevaUrlFoto = await subirACloudinary(archivoFotoNuevo);
      }

      const fotoActualizada = await cambiarFotoPerfilUsuario(nombreUsuarioLocal, nuevaUrlFoto);
      setFotoPerfilUsuario(fotoActualizada ?? nuevaUrlFoto);
      setArchivoFotoNuevo(null);
      setEliminarFotoPerfil(false);
      setMensajeFotoPerfil({
        tipo: "success",
        texto: nuevaUrlFoto === null
          ? "Foto de perfil eliminada correctamente."
          : "Foto de perfil actualizada correctamente.",
      });
    } catch (error) {
      console.error("Error al guardar la foto de perfil:", error);
      setMensajeFotoPerfil({
        tipo: "error",
        texto: "No se pudo actualizar la foto de perfil. Intenta nuevamente.",
      });
    } finally {
      setGuardandoFoto(false);
    }
  };

  const manejarSalirModoEdicion = () => {
    setMostrarEditar(false);
    setArchivoFotoNuevo(null);
    setEliminarFotoPerfil(false);
    setMensajeFotoPerfil(null);
    setReinicioFormularioFoto((valorAnterior) => valorAnterior + 1);
  };

  const manejarDeshacerCambiosFoto = () => {
    setArchivoFotoNuevo(null);
    setEliminarFotoPerfil(false);
    setMensajeFotoPerfil({
      tipo: "info",
      texto: "Se deshicieron los cambios de la foto de perfil.",
    });
    setReinicioFormularioFoto((valorAnterior) => valorAnterior + 1);
  };

  const manejarLimpiarFoto = () => {
    if (archivoFotoNuevo) {
      setArchivoFotoNuevo(null);
      setEliminarFotoPerfil(false);
      setMensajeFotoPerfil({
        tipo: "info",
        texto: "Se quitó la foto cargada."
      });
      setReinicioFormularioFoto((valorAnterior) => valorAnterior + 1);
      return;
    }

    if (tieneFotoGuardada) {
      setEliminarFotoPerfil(true);
      setMensajeFotoPerfil({
        tipo: "info",
        texto: "La foto se eliminará cuando guardes los cambios.",
      });
    }
  };

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
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-slate-950 via-amber-900 to-blue-950">
      <NavBar cuantasSolicitudesAmistad={numSolicitudes} />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row">
        {/*Contenido*/}
        <div className="flex w-full shrink-0 flex-col items-center justify-start gap-5 rounded-lg border border-sky-900/60 bg-slate-900/70 p-4 shadow-2xl shadow-black/20 sm:p-5 lg:w-[26rem]">
          {/*Perfil*/}
          {puedeEditar && mostrarEditar ? (
            <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-sky-900/60 bg-slate-900/85 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <div className="mb-2">
                <h3 className="text-center text-xl font-semibold text-amber-50">Foto de perfil</h3>
                <p className="mt-2 text-center text-sm text-emerald-200/80">
                  Sube o elimina tu imagen para actualizar tu perfil.
                </p>
              </div>

              {eliminarFotoPerfil ? (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border border-rose-800 bg-slate-900 px-3 text-center text-xs font-semibold text-rose-200">
                  La foto se eliminará al guardar
                </div>
              ) : (
                <FormularioSubirImagen
                  key={`selector-foto-${reinicioFormularioFoto}`}
                  urlImagenActual={fotoPerfilUsuario}
                  onArchivoSeleccionado={(archivo) => {
                    setArchivoFotoNuevo(archivo);
                    if (archivo) {
                      setEliminarFotoPerfil(false);
                      setMensajeFotoPerfil({
                        tipo: "info",
                        texto: "Nueva foto seleccionada. Presiona Guardar cambio de foto para confirmar.",
                      });
                    }
                  }}
                  deshabilitado={guardandoFoto}
                />
              )}

              <div className="flex w-full flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  className={`h-10 rounded-md border px-4 text-sm font-medium transition ${botonLimpiarFotoDeshabilitado
                    ? "cursor-not-allowed border-rose-900/70 bg-rose-950/70 text-rose-300/70 opacity-70"
                    : "cursor-pointer border-rose-500/50 bg-rose-700 text-rose-100 hover:bg-rose-800"
                    }`}
                  onClick={manejarLimpiarFoto}
                  disabled={botonLimpiarFotoDeshabilitado}
                >
                  Limpiar foto
                </button>

                <button
                  type="button"
                  className="h-10 cursor-pointer rounded-md bg-amber-500 px-4 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={manejarGuardarFotoPerfil}
                  disabled={guardandoFoto || !hayCambiosFotoPendientes}
                >
                  {guardandoFoto ? "Guardando foto..." : "Guardar cambio de foto"}
                </button>

                <button
                  type="button"
                  className="h-10 cursor-pointer rounded-md border border-sky-500/60 bg-sky-700 px-4 text-sm font-medium text-sky-100 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:border-sky-800/70 disabled:bg-sky-900/70 disabled:text-sky-200/70 disabled:opacity-70"
                  onClick={manejarDeshacerCambiosFoto}
                  disabled={guardandoFoto || !hayCambiosFotoPendientes}
                >
                  Deshacer cambios
                </button>
              </div>

              <div
                className={`w-full overflow-hidden text-center transition-all duration-300 ${mensajeFotoPerfil ? "mt-2 max-h-20 opacity-100" : "mt-0 max-h-0 opacity-0"}`}
              >
                {mensajeFotoPerfil && (
                  <p
                    className={`text-sm ${mensajeFotoPerfil.tipo === "success"
                      ? "text-emerald-300"
                      : mensajeFotoPerfil.tipo === "error"
                        ? "text-rose-300"
                        : "text-sky-300"}`}
                  >
                    {mensajeFotoPerfil.texto}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-45 w-45 items-center justify-center rounded-full bg-slate-800 text-amber-100 overflow-hidden md:h-70 md:w-70">
              {cargandoFoto ? (
                <span className="text-center text-sm font-bold">Cargando foto...</span>
              ) : fotoPerfilUsuario ? (
                <img
                  src={fotoPerfilUsuario}
                  alt={`Foto de perfil de ${nombreUsuarioParam}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src="/assets/icons/userProfile.svg"
                  alt={`Foto de perfil de ${nombreUsuarioParam}`}
                  className="h-full w-full object-cover "
                />
              )}
            </div>
          )}
          {nombreUsuarioLocal && nombreUsuarioLocal === nombreUsuarioParam ? (
            <div className="flex flex-col justify-start items-center w-full h-2/5 gap-5">
              {!mostrarEditar && (
                <p className="text-l text-center font-bold text-amber-100">
                  {nombreUsuarioParam}
                </p>
              )}
              <div
                className={`grid w-full transition-[grid-template-rows,opacity] duration-500 ease-in-out ${mostrarEditar ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col items-center justify-start gap-5">
                    <button
                      className="mt-2 w-full cursor-pointer rounded bg-amber-500 px-4 py-2 text-slate-950 hover:bg-amber-400 sm:w-auto"
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
                    <button
                      type="button"
                      className="w-fit self-center cursor-pointer rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-slate-600"
                      onClick={manejarSalirModoEdicion}
                      disabled={guardandoFoto}
                    >
                      Salir del modo edición
                    </button>
                    <FormularioEditarNombreUsuario
                      manejarVolver={() => setMostrarEditar(false)}
                    />
                    <FormularioEditarContrasena
                      manejarVolver={() => setMostrarEditar(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex w-full max-w-md flex-col items-center justify-start gap-5">
                <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-x-5">
                  <p className="text-center text-amber-100">{nombreUsuarioParam}</p>
                  {
                    solicitudesAmistadEnviadas.includes(nombreUsuarioParam) ? (
                        <BotonConIcono
                        variant="pendiente"
                        texto="Cancelar solicitud de amistad"
                        ruta_icono="/assets/icons/pendiente.svg"
                        funcion={() => emitirCancelarSolicitudAmistad(nombreUsuarioParam)}
                        className="flex-row-reverse text-orange-100"
                        tamanioIcon="h-6 w-6"
                      />
                    )
                    : esAmigo ? (
                      <BotonConIcono
                        variant="destructive"
                        texto="Eliminar amigo"
                        ruta_icono="/assets/icons/eliminar.svg"
                        funcion={() => manejarEliminarAmigo()}
                        className="flex-row-reverse text-red-100"
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
                        className="flex-row-reverse text-green-100"
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

        <div className="flex w-full min-w-0 flex-1 flex-col gap-5 sm:gap-6">
          <div className="flex min-w-0 flex-col items-center justify-start">

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
              actualizarTrigger={actualizarTabla}
            />
          </div>
          <div className="flex min-w-0 flex-col items-center justify-start gap-5">
            <TablaHistorial nombreUsuario={nombreUsuarioParam} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
