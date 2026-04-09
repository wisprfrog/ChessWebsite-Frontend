"use client";

import FormularioInicioSesion from "../../components/formularioInicioSesion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validarToken } from "../../services/api";

export default function PaginaInicioSesion() {
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
        <h1>Inicia Sesion</h1>
        <p>Ingresa tus datos a continuación:</p>

        <FormularioInicioSesion />
        <p>
          ¿No tienes cuenta? <a href="../registrarse">Regístrate aquí</a>
        </p>
      </div>
    </main>
  );
}
