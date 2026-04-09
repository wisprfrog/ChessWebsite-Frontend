"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import FormularioRegistro from "../../components/formularioRegistro";
import { validarToken } from '@/src/services/api';

export default function PaginaRegistro() {
  const router = useRouter();
  const [funcionaToken, setFuncionaToken] = useState<boolean | null>(null);
const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

  async function comprobarToken ()  {
    const token = localStorage.getItem("token");

    if (!token) {
      setFuncionaToken(false);
      return;
    } else {
      try {
        const respuesta = await validarToken(token); //respuesta es true o false

        setFuncionaToken(respuesta);

        if (!respuesta){
          localStorage.removeItem("token");
          localStorage.removeItem("nombre_usuario");
        }
        else{
          const nombre_usuario = localStorage.getItem("nombre_usuario");
          setNombreUsuario(nombre_usuario);
        }
      } catch (error) {
        console.log("Error al verificar el token:", error);
      }
    }
  };

  useEffect(() => {
    comprobarToken();
  }, []);

  useEffect(() => {
    if (funcionaToken) router.push("./");
  }, [funcionaToken]);

  if(funcionaToken === true && nombreUsuario) return null;

  return (
    <main
      style={{ padding: "50px", display: "flex", justifyContent: "center" }}
    >
      <div>
        <h1>Crea una cuenta nueva</h1>
        <p>Ingresa tus datos a continuación:</p>

        <FormularioRegistro />
        <p>
          ¿Ya tienes una cuenta?{" "}
          <a href="../inicio_sesion">Inicia sesión aquí</a>
        </p>
      </div>
    </main>
  );
}
