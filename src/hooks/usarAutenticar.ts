import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validarToken } from "../services/api";

export function usarAutenticar() {
  const router = useRouter();

  const [funcionaToken, setFuncionaToken] = useState<boolean | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

  async function comprobarToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        setFuncionaToken(false);
        return;
      }

      try {
        const respuesta = await validarToken(token);
        setFuncionaToken(respuesta);

        if (!respuesta) {
          localStorage.removeItem("token");
          localStorage.removeItem("nombre_usuario");
        }
      } catch (error) {
        console.log("Error al verificar el token:", error);
        setFuncionaToken(false);
      }
    };

  useEffect(() => {
    comprobarToken();
  }, []);

  useEffect(() => {
    if (funcionaToken === false) {
      router.push("/inicio_sesion");
    }

    if (funcionaToken === true) {
      setNombreUsuario(localStorage.getItem("nombre_usuario"));
    }
  }, [funcionaToken]);

  return {
    funcionaToken,
    nombreUsuario,
  };
}