"use client";

import { useEffect, useState } from "react";
import { Button, ConfigProvider, Modal, Table } from "antd";
import BotonConIcono from "./boton";
import { useMonsterSocket } from "../hooks/usarSocketMonster";

export default function PopupSolicitudes({
  usarTriggerTexto = false,
  onCantidadInvitacionesChange,
}) {
  const [mostrarPopupSolicitudes, setMostrarPopupSolicitudes] = useState(false);
  const [invitacionesActivas, setInvitacionesActivas] = useState([]);

  const { emitirAceptarInvitacionPartida, emitirRechazarInvitacionPartida } =
    useMonsterSocket({
      manejarCargarInvitacionesPartida: (invitaciones) => {
        setInvitacionesActivas(Array.isArray(invitaciones) ? invitaciones : []);
      },
      manejarNuevaInvitacionPartida: (invitaciones) => {
        setInvitacionesActivas(Array.isArray(invitaciones) ? invitaciones : []);
      },
    });

  const manejarAceptarInvitacion = (nombreJugador) => {
    console.log("Aceptar invitación de:", nombreJugador);
    emitirAceptarInvitacionPartida(nombreJugador);
    setInvitacionesActivas((prev) =>
      prev.filter((invitacion) => invitacion !== nombreJugador),
    );
  };

  const manejarCancelarInvitacion = (nombreJugador) => {
    emitirRechazarInvitacionPartida(nombreJugador);
    setInvitacionesActivas((prev) =>
      prev.filter((invitacion) => invitacion !== nombreJugador),
    );
  };

  const columnas = [
    {
      title: "Jugador",
      dataIndex: "jugador",
      key: "jugador",
    },
    {
      title: "",
      key: "acciones",
      render: (_, registro) => (
        <div className="flex gap-2 justify-end">
          <Button
            type="primary"
            size="small"
            onClick={() => manejarAceptarInvitacion(registro.jugador)}
          >
            Aceptar
          </Button>
          <Button
            danger
            size="small"
            onClick={() => manejarCancelarInvitacion(registro.jugador)}
          >
            Cancelar
          </Button>
        </div>
      ),
    },
  ];

  const dataSource = invitacionesActivas.map((invitacion, index) => ({
    key: index,
    jugador: invitacion,
  }));
  console.log("dataSource:", dataSource);

  useEffect(() => {
    if (typeof onCantidadInvitacionesChange === "function") {
      onCantidadInvitacionesChange(invitacionesActivas.length);
    }
  }, [invitacionesActivas.length, onCantidadInvitacionesChange]);

  return (
    <>
      <div className="w-content h-content relative">
        {usarTriggerTexto ? (
          <button
            type="button"
            className="flex w-full items-center justify-end gap-2 rounded-lg px-3 py-2 text-right font-bold text-emerald-50 hover:bg-slate-800 hover:text-sky-300"
            onClick={() =>
              setMostrarPopupSolicitudes((valorActual) => !valorActual)
            }
          >
            <span>Invitaciones a partida</span>
            {invitacionesActivas.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {invitacionesActivas.length > 99
                  ? "99+"
                  : invitacionesActivas.length}
              </span>
            )}
          </button>
        ) : (
          <BotonConIcono
            className="flex justify-center items-center w-fit h-fit p-1 rounded-full hover:bg-yellow-100"
            tamanioIcon="h-6 w-auto"
            size="icon"
            ruta_icono="/assets/icons/bell.svg"
            variant="ghost"
            funcion={() =>
              setMostrarPopupSolicitudes((valorActual) => !valorActual)
            }
          />
        )}

        {!usarTriggerTexto && invitacionesActivas.length > 0 && (
          <span className="absolute z-1 -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {}
            {invitacionesActivas.length > 99
              ? "99+"
              : invitacionesActivas.length}
          </span>
        )}
      </div>

      <ConfigProvider
        theme={{
          token: {
            colorBgElevated: "#0f172a",
            colorText: "#fef3c7",
            colorTextHeading: "#fef3c7",
            colorBorderSecondary: "#1e3a5f",
          },
          components: {
            Modal: {
              contentBg: "#0f172a",
              headerBg: "#0f172a",
              titleColor: "#fef3c7",
            },
            Table: {
              headerBg: "#172554",
              headerColor: "#fef3c7",
              rowHoverBg: "#1e293b",
              colorBgContainer: "#0f172a",
              colorText: "#f8fafc",
              borderColor: "#1e3a5f",
            },
          },
        }}
      >
        <Modal
          title="Invitaciones a partidas"
          open={mostrarPopupSolicitudes}
          onCancel={() => setMostrarPopupSolicitudes(false)}
          footer={null}
          width={500}
        >
          <Table
            columns={columnas}
            dataSource={dataSource}
            pagination={false}
            locale={{ emptyText: "No hay invitaciones activas" }}
            size="small"
            scroll={{ y: 240 }}
          />
        </Modal>
      </ConfigProvider>
    </>
  );
}
