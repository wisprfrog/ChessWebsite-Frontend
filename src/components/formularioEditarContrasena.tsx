import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
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
      className="w-full h-full"
    >
      <p className="mb-4"><strong>Cambiar contraseña</strong></p>
      <Form.Item label="Contraseña actual" name="contrasena_anterior">
        <Input
          id="contrasena_anterior"
          type="password"
          placeholder="Contraseña actual"
          value={contrasenaAnterior}
          onChange={(e) => setContrasenaAnterior(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Contraseña nueva" name="contrasena_nueva">
        <Input
          id="contrasena_nueva"
          type="password"
          placeholder="Contraseña nueva"
          value={contrasenaNueva}
          onChange={(e) => setContrasenaNueva(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Confirmar contraseña" name="confirmar_contrasena">
        <Input
          id="confirmar_contrasena"
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />
      </Form.Item>

      <div
        className={`overflow-hidden transition-all duration-300 ${contrasenaEditadaVisible ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
      >
        {contrasenaEditadaVisible && (
          <p className={`text-${contrasenaEditadaVisible[0] ? "green" : "red"}-500 mb-10`}>
            {contrasenaEditadaVisible[1]}
          </p>
        )}
      </div>

      <div className="flex justify-start items-center gap-4">
        <Button type="primary" htmlType="submit" disabled={redirigiendo}>
          {cargando ? "Guardando..." : "Guardar contraseña"}
        </Button>
        <Button type="default" onClick={manejarVolverCompleto} disabled={redirigiendo}>
          Volver
        </Button>
      </div>
    </Form>
  );
};

export default FormularioEditarContrasena;
