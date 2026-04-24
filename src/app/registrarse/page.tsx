"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormularioRegistro from "../../components/formularioRegistro";
import { validarToken } from "../../services/api";

export default function PaginaRegistro() {
  const router = useRouter();
  const [funcionaToken, setFuncionaToken] = useState<boolean | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

  async function comprobarToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      setFuncionaToken(false);
      return;
    } else {
      try {
        const respuesta = await validarToken(token); //respuesta es true o false

        setFuncionaToken(respuesta);

        if (!respuesta) {
          localStorage.removeItem("token");
          localStorage.removeItem("nombre_usuario");
        } else {
          const nombre_usuario = localStorage.getItem("nombre_usuario");
          setNombreUsuario(nombre_usuario);
        }
      } catch (error) {
        console.log("Error al verificar el token:", error);
      }
    }
  }

  useEffect(() => {
    comprobarToken();
  }, []);

  useEffect(() => {
    if (funcionaToken) router.push("./");
  }, [funcionaToken]);

  if (funcionaToken === true && nombreUsuario) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-amber-900 to-blue-950 p-4">
      <div className="w-full max-w-md flex flex-col items-center mt-4">
        <h1 className="text-nowrap text-center min-[600px]:text-4xl min-[430px]:text-3xl text-xl font-bold uppercase text-amber-100">   
           Monster Chess of Clans
        </h1>
        <FormularioRegistro />
      </div>
    </main>
  );
}
