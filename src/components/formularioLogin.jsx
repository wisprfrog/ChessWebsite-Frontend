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
    <main className="flex w-full flex-col items-center justify-center p-4">
        <div className="w-full flex flex-col items-center gap-8">
          <h1 className="text-center text-3xl font-bold uppercase text-amber-100">   
           Monster Chess of Clans
        </h1>
      <section className="mt-4 flex w-full max-w-sm flex-col items-center rounded-xl border border-sky-900/60 bg-slate-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm" > 
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-amber-50">Inicia sesion con tu cuenta</h2>
          <p className="mt-2 text-sm text-emerald-200/80">
            Ingresa tu correo electronico o nombre de usuario y contraseña para acceder a tu cuenta.
          </p>
        </div>

        <form onSubmit={enviarInicioSesion} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <label htmlFor="usuario" className="text-sm font-medium text-amber-100">
              Email o Nombre de Usuario
            </label>
            <input
              id="usuario"
              type="text"
              placeholder="m@example.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="h-10 rounded-md border border-slate-600 bg-slate-800 px-3 text-sm text-amber-50 outline-none transition placeholder:text-slate-300/60 focus:border-amber-400"
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="password" className="text-sm font-medium text-amber-100">
                Contraseña
              </label>
              
            </div>
            <input
              id="password"
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className="h-10 rounded-md border border-slate-600 bg-slate-800 px-3 text-sm text-amber-50 outline-none transition placeholder:text-slate-300/60 focus:border-amber-400"
              required
            />
          </div>

          {mensaje ? <p className="text-sm text-rose-300">{mensaje}</p> : null}

          <button
            type="submit"
            className="h-10 w-full rounded-md bg-amber-500 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Iniciar Sesion"}
          </button>

          <a href="../registrarse" className="text-center text-sm text-amber-100">
            <p className="text-amber-100 underline-offset-4"> No tienes cuenta?</p> <p className="underline text-amber-100 underline-offset-4 hover:text-yellow-300"> Registrate aquí</p>
          </a>
        </form>
      </section>
      </div>
      </main>
    )
  }

  return null;
}

export default Login;
