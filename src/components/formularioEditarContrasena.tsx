import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { cambiarContrasena } from "../services/api";

const DEMORA_MENSAJE_ERROR_MS = 5000;
const MODO_VISTA_PREVIA_MENSAJES = false;

type LayoutType = Parameters<typeof Form>[0]["layout"];
type Props = {
  manejarVolver: () => void;
};

const FormularioEditarContrasena: React.FC<Props> = ({ manejarVolver }) => {
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
  const [contrasenaAnterior, setContrasenaAnterior] = useState<string>("");
  const [contrasenaNueva, setContrasenaNueva] = useState<string>("");
  const [confirmarContrasena, setConfirmarContrasena] = useState<string>("");

  //useState de confirmacion
  const [cargando, setCargando] = useState(false);
  const [contrasenaEditada, setContrasenaEditada] = useState<
    [boolean, string] | null
  >(null);
  const [redirigiendo, setRedirigiendo] = useState(false);

  const contrasenaEditadaVisible: [boolean, string] | null =
    MODO_VISTA_PREVIA_MENSAJES
      ? [true, "Vista previa: contraseña actualizada correctamente"]
      : contrasenaEditada;
  const redirigiendoVisible = MODO_VISTA_PREVIA_MENSAJES ? true : redirigiendo;

  useEffect(() => {
    if (contrasenaEditada && contrasenaEditada[0] === true) {
      const timeoutId = window.setTimeout(() => {
        setContrasenaEditada(null);
      }, DEMORA_MENSAJE_ERROR_MS);

      return () => window.clearTimeout(timeoutId);
    }
  }, [contrasenaEditada]);

  async function manejarCambioContrasena(
    token: string | null,
    contrasenaAnterior: string,
    contrasenaNueva: string,
  ): Promise<Response> {
    const res = (await cambiarContrasena(
      token,
      contrasenaAnterior,
      contrasenaNueva,
    )) as Response;

    return res;
  }

  async function enviarFormularioEditarPerfil(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setCargando(true);
    setContrasenaEditada(null);
      
    if (contrasenaAnterior && contrasenaNueva && confirmarContrasena) {
      if (contrasenaNueva === confirmarContrasena) {
        const res = await manejarCambioContrasena(
          token,
          contrasenaAnterior,
          contrasenaNueva,
        );

        const resJson = await res.json();
        setContrasenaAnterior("");
        setContrasenaNueva("");
        setConfirmarContrasena("");
        setContrasenaEditada([res.status === 200, resJson.message]);
      } else {
        setContrasenaEditada([false, "Las contraseñas nuevas no coinciden"]);
      }
    }

    setCargando(false);
  }

  const manejarVolverCompleto = () => {
    form.resetFields();
    setContrasenaAnterior("");
    setContrasenaNueva("");
    setConfirmarContrasena("");
    setContrasenaEditada(null);
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
          Cambiar contraseña
        </h3>
        <p className="mt-2 text-sm text-emerald-200/80 text-center">
          Protege tu cuenta con una nueva contraseña.
        </p>
      </div>
      <Form.Item
        label={<span className="text-sm font-medium text-amber-100">Contraseña actual</span>}
        name="contrasena_anterior"
      >
        <Input
          id="contrasena_anterior"
          type="password"
          placeholder="Contraseña actual"
          value={contrasenaAnterior}
          className="!h-10 !rounded-md !border !border-amber-500/60 !bg-slate-700 !px-3 !text-sm !text-amber-50 !shadow-none placeholder:!text-amber-100/50 focus:!border-amber-300"
          onChange={(e) => setContrasenaAnterior(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={<span className="text-sm font-medium text-amber-100">Contraseña nueva</span>}
        name="contrasena_nueva"
      >
        <Input
          id="contrasena_nueva"
          type="password"
          placeholder="Contraseña nueva"
          value={contrasenaNueva}
          className="!h-10 !rounded-md !border !border-amber-500/60 !bg-slate-700 !px-3 !text-sm !text-amber-50 !shadow-none placeholder:!text-amber-100/50 focus:!border-amber-300"
          onChange={(e) => setContrasenaNueva(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label={<span className="text-sm font-medium text-amber-100">Confirmar contraseña</span>}
        name="confirmar_contrasena"
      >
        <Input
          id="confirmar_contrasena"
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarContrasena}
          className="!h-10 !rounded-md !border !border-amber-500/60 !bg-slate-700 !px-3 !text-sm !text-amber-50 !shadow-none placeholder:!text-amber-100/50 focus:!border-amber-300"
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />
      </Form.Item>

      <div
        className={`overflow-hidden transition-all duration-300 ${contrasenaEditadaVisible ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
      >
        {contrasenaEditadaVisible && (
          <p className={contrasenaEditadaVisible[0] ? "mb-4 text-sm text-emerald-300" : "mb-4 text-sm text-rose-300"}>
            {contrasenaEditadaVisible[1]}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={redirigiendo}
          className="h-10 rounded-md bg-amber-500 px-4 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? "Guardando..." : "Guardar contraseña"}
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

export default FormularioEditarContrasena;
