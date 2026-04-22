import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { cambiarNombreUsuario, generarToken } from "../services/api";

const DEMORA_REDIRECCION_MS = 5000; //3600
const DEMORA_MENSAJE_ERROR_MS = 5000;
const MODO_VISTA_PREVIA_MENSAJES = false;

type LayoutType = Parameters<typeof Form>[0]["layout"];
type Props = {
  manejarVolver: () => void;
};

const FormularioEditarNombreUsuario: React.FC<Props> = ({ manejarVolver }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string>("");

  useEffect(() => {
    const tokenLS = localStorage.getItem("token");
    setToken(tokenLS);

    const nombreUsuarioLS = localStorage.getItem("nombre_usuario");
    if (nombreUsuarioLS) setNombreUsuario(nombreUsuarioLS);
  }, []);

  //useState para los campos del formulario de edición de perfil
  const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState<string>("");

  //useState de confirmacion
  const [cargando, setCargando] = useState(false);
  const [usuarioEditado, setUsuarioEditado] = useState<
    [boolean, string] | null
  >(null);
  const [redirigiendo, setRedirigiendo] = useState(false);

  const usuarioEditadoVisible: [boolean, string] | null =
    MODO_VISTA_PREVIA_MENSAJES
      ? [false, "Vista previa: error al actualizar el nombre de usuario"]
      : usuarioEditado;
  const redirigiendoVisible = MODO_VISTA_PREVIA_MENSAJES ? true : redirigiendo;

  useEffect(() => {
    if (usuarioEditado && usuarioEditado[0] === true) {
      setRedirigiendo(true);
      const timeoutId = window.setTimeout(() => {
        window.dispatchEvent(new Event("nombre-usuario-actualizado"));
        router.replace(`/perfil?usuario=${encodeURIComponent(nuevoNombreUsuario)}`);
        manejarVolver();
      }, DEMORA_REDIRECCION_MS);

      return () => window.clearTimeout(timeoutId);
    }
    setRedirigiendo(false);
  }, [manejarVolver, nuevoNombreUsuario, router, usuarioEditado]);

  useEffect(() => {
    if (usuarioEditado && usuarioEditado[0] === false) {
      const timeoutId = window.setTimeout(() => {
        setUsuarioEditado(null);
      }, DEMORA_MENSAJE_ERROR_MS);

      return () => window.clearTimeout(timeoutId);
    }
  }, [usuarioEditado]);

  async function manejarCambioNombre(
    token: string | null,
    nombreUsuario: string,
    nuevoNombreUsuario: string,
  ): Promise<Response> {
    const res = (await cambiarNombreUsuario(
      token,
      nombreUsuario,
      nuevoNombreUsuario,
    )) as Response;

    if (res.status === 200) {
      const tokenNuevo = await generarToken(nuevoNombreUsuario, null, null);

      const tokenNuevoJson = await tokenNuevo.json();
      setToken(tokenNuevoJson.token);

      localStorage.setItem("token", tokenNuevoJson.token);
      localStorage.setItem("nombre_usuario", nuevoNombreUsuario);
      setNombreUsuario(nuevoNombreUsuario);
    }

    return res;
  }

  async function enviarFormularioEditarPerfil(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setCargando(true);
    setUsuarioEditado(null);

    if (nuevoNombreUsuario && nuevoNombreUsuario !== nombreUsuario) {
      if (nuevoNombreUsuario.match(/[a-zA-Z][a-zA-Z0-9_]*$/)) {
        const res = await manejarCambioNombre(
          token,
          nombreUsuario,
          nuevoNombreUsuario,
        );

        setUsuarioEditado([
          res.status === 200,
          res.status === 200
            ? "Nombre de usuario actualizado"
            : "Error al actualizar el nombre de usuario",
        ]);
      } else {
        setNuevoNombreUsuario("");
        setUsuarioEditado([false, "Nombre de usuario no válido"]);
      }
    }
    else{
      if(nuevoNombreUsuario === nombreUsuario){
        setUsuarioEditado([false, "El nuevo nombre de usuario no puede ser igual al actual"]);
      }
    }

    setCargando(false);
  }

  const manejarVolverCompleto = () => {
    form.resetFields();
    setNuevoNombreUsuario("");
    setUsuarioEditado(null);
    manejarVolver();
  }

  return (
    <Form
      layout={"vertical" as LayoutType}
      form={form}
      onSubmitCapture={enviarFormularioEditarPerfil}
      initialValues={{ layout: "vertical" }}
      className="w-full rounded-xl border border-sky-900/60 bg-slate-900/85 !p-8 shadow-2xl shadow-black/30 backdrop-blur-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-amber-50 text-center">
          Cambiar nombre de usuario
        </h3>
        <p className="mt-2 text-sm text-emerald-200/80 text-center">
          Actualiza tu nombre visible en el perfil.
        </p>
      </div>
      <Form.Item
        label={<span className="text-sm font-medium text-amber-100">Usuario</span>}
        name="nuevo_nombre_usuario"
        htmlFor="nuevo_nombre_usuario"
      >
        <Input
          id="nuevo_nombre_usuario"
          placeholder="Nuevo nombre de usuario"
          value={nuevoNombreUsuario}
          name="nuevo_nombre_usuario"
          className="!h-10 !rounded-md !border !border-amber-500/60 !bg-slate-700 !px-3 !text-sm !text-amber-50 !shadow-none placeholder:!text-amber-100/50 focus:!border-amber-300"
          onChange={(e) => setNuevoNombreUsuario(e.target.value)}
        />
      </Form.Item>

      <div
        className={`overflow-hidden transition-all duration-300 ${usuarioEditadoVisible ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
      >
        {usuarioEditadoVisible && (
          <p className={usuarioEditadoVisible[0] ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
            {usuarioEditadoVisible[1]}
          </p>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${redirigiendoVisible ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
      >
        {redirigiendoVisible && (
          <p className="mb-4 text-sm text-sky-300">Redirigiendo al perfil actualizado...</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={redirigiendo}
          className="h-10 rounded-md bg-amber-500 px-4 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? "Guardando..." : "Guardar nombre"}
        </button>
        <button
          type="button"
          onClick={manejarVolverCompleto}
          disabled={redirigiendo}
          className="h-10 rounded-md border border-slate-600 bg-slate-800 px-4 text-sm font-medium text-amber-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Volver
        </button>
      </div>
    </Form>
  );
};

export default FormularioEditarNombreUsuario;
