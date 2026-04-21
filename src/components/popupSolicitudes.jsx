"use client";

import { useState } from "react";
import { Button, Modal, Table } from "antd";
import BotonConIcono from "./boton";
import { useMonsterSocket } from "../hooks/usarSocketMonster";

export default function PopupSolicitudes() {
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

  return (
    <>
      <div className="w-content h-content relative">
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

        {invitacionesActivas.length > 0 && (
          <span className="absolute z-1 -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {}
            {invitacionesActivas.length > 99
              ? "99+"
              : invitacionesActivas.length}
          </span>
        )}
      </div>

      <Modal
        title="Invitaciones a partidas"
        open={mostrarPopupSolicitudes}
        onCancel={() => setMostrarPopupSolicitudes(false)}
        footer={null}
        style={{ position: "absolute", top: 60, right: 120 }}
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
    </>
  );
}
