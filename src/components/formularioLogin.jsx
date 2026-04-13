"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generarToken } from "@/services/api";

export function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [iniciarSesion, setIniciarSesion] = useState(false);

  const enviarInicioSesion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      let nombre_usuario = "";
      let correo = "";

      if (/^[a-zA-Z0-9._%+-]+@[a-z]+\.[a-zA-Z]{2,}$/.test(usuario)) correo = usuario;
      else nombre_usuario = usuario;

      const respuesta = await generarToken(nombre_usuario, correo, contrasenia);

      if (respuesta.ok) {
        const res = await respuesta.json();

        localStorage.setItem("token", res.token);
        localStorage.setItem("nombre_usuario", res.datos_usuario.nombre_usuario);

        setIniciarSesion(true);

        router.push("/");
        return;
      }

      setMensaje("Usuario o contraseña incorrectos.");
    } catch (error) {
      console.error("Error en la petición:", error);
      setMensaje("Error en el servidor. Por favor, intenta nuevamente más tarde.");
    } finally {
      setCargando(false);
    }
  };

  if(!iniciarSesion){
    return (
      <section className="w-full max-w-sm rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Inicia sesion con tu cuenta</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Ingresa tu correo electronico o nombre de usuario y contraseña para acceder a tu cuenta.
          </p>
        </div>

        <form onSubmit={enviarInicioSesion} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <label htmlFor="usuario" className="text-sm font-medium text-zinc-800">
              Email o Nombre de Usuario
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="m@example.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-500"
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="password" className="text-sm font-medium text-zinc-800">
                Contraseña
              </label>
              
            </div>
            <input
              id="password"
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-500"
              required
            />
          </div>

          {mensaje ? <p className="text-sm text-red-600">{mensaje}</p> : null}

          <button
            type="submit"
            className="h-10 w-full rounded-md bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Iniciar Sesion"}
          </button>

          <a href="../registrarse" className="text-center text-sm underline-offset-4 hover:underline">
            Registrarme
          </a>
        </form>
      </section>
    )
  }

  return null;
}

export default Login;
