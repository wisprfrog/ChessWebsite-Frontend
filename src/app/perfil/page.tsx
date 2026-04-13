"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usarAutenticar } from "../../hooks/usarAutenticar";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";

// Componente de perfil de usuario
import FormularioEditarNombreUsuario from "../../components/formularioEditarNombre";
import FormularioEditarContrasena from "../../components/formularioEditarContrasena";
import TablaEstadisticas from "@/components/tablaEstadisticas";

export default function Perfil() {
  const searchParams = useSearchParams();
  const nombreUsuarioParam = searchParams.get("usuario");
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [nombreUsuarioLocal, setNombreUsuarioLocal] = useState<string | null>(
    null,
  );

  const { funcionaToken } = usarAutenticar();

  useEffect(() => {
    const actualizarNombreUsuario = () => {
      setNombreUsuarioLocal(localStorage.getItem("nombre_usuario"));
    };

    actualizarNombreUsuario();
    window.addEventListener("storage", actualizarNombreUsuario);
    window.addEventListener("nombre-usuario-actualizado", actualizarNombreUsuario);

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
  }, [nombreUsuarioParam]);

  const puedeEditar = nombreUsuarioParam === nombreUsuarioLocal;

  if (funcionaToken === null || nombreUsuarioLocal === null || nombreUsuarioParam === null) return null;

  return (
      <div className="flex flex-col w-full min-h-screen justify-start items-stretch">
        <NavBar />
        <div className="relative flex flex-col md:flex-row w-full flex-1 justify-center items-start p-20">
          {/*Contenido*/}
          <div className="flex flex-col w-2/5 h-min-90/100 h-content justify-start items-center gap-5 ">
            {/*Perfil*/}
            <div className="flex justify-center items-center w-70 h-70 rounded-full bg-gray-500">
              Imagen de mi bro {nombreUsuarioParam}
            </div>
            {
              nombreUsuarioLocal && nombreUsuarioLocal === nombreUsuarioParam ?
                (
                  <div className="flex flex-col justify-start items-center w-full h-2/5 gap-5">
                    <p className="text-center">
                      Usuario: {nombreUsuarioParam}
                    </p>
                    <div
                      className={`grid w-1/2 transition-[grid-template-rows,opacity] duration-500 ease-in-out ${mostrarEditar ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col justify-start items-center h-2/5 gap-5">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
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
                        <div className="flex gap-15">
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
                )
                :
                <div className="flex flex-col justify-start items-center w-1/2 h-2/5 gap-5">
                  <p className="text-center">
                    {nombreUsuarioParam}
                  </p>
                  <TablaEstadisticas nombreUsuario={nombreUsuarioParam} />
                </div>
            }
          </div>
          <div className="flex flex-col w-3/5 h-full ">
          Mas informacion
          </div>
        </div>
        <Footer />
      </div>
    );
}
