'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Empty, Table } from 'antd';
import type { TableProps } from 'antd';
import Link from 'next/link';
import { eliminarAmigo, agregarAmigo, obtenerListaAmigos, obtenerIdUsuario } from '@/services/api';
import BotonConIcono from './boton';

interface DataType {
  key: string;
  amigo: string;
  idAmigo: string | number;
}

const normalizarId = (id: string | number) => String(id);

interface FriendApiItem {
  id?: string | number;
  id_amigo?: string | number;
  nombre_usuario?: string;
  nombre_amigo?: string;
}

interface TablaAmigosProps {
  manejarEnviarSolicitud: (nombre_usuario_destino: string) => void;
  manejarCancelarSolicitud: ((nombre_usuario_destino: string) => void) | null;
  manejarAceptarSolicitud: ((nombre_usuario_origen: string) => void) | null;
  manejarRechazarSolicitud: ((nombre_usuario_origen: string) => void) | null;
  manejarEnviarInvitacionPartida?: ((nombre_usuario_destino: string) => void) | null;
  listaSolicitudesEnviadas: Array<string> | null;
  listaSolicitudesRecibidas: Array<string> | null;
  nombreUsuario?: string | null;
  mostrarEliminar?: boolean;
  mostarAgregar?: boolean;
  actualizarTrigger?: number;
}

export default function TablaAmigos({ manejarEnviarSolicitud, manejarCancelarSolicitud, manejarAceptarSolicitud, manejarRechazarSolicitud, manejarEnviarInvitacionPartida, listaSolicitudesEnviadas, listaSolicitudesRecibidas, nombreUsuario, mostrarEliminar = true, mostarAgregar = true, actualizarTrigger = 0 }: TablaAmigosProps) {
  const [data, setData] = useState<DataType[]>([]);
  
  const [idPerfilVisto, setIdPerfilVisto] = useState<string | number | null>(null);

  const [miNombreLocal, setMiNombreLocal] = useState<string | null>(null);
  const [miIdLocal, setMiIdLocal] = useState<string | number | null>(null);
  const [misAmigosIds, setMisAmigosIds] = useState<string[]>([]);
  const [solicitudesEnviadasLocal, setSolicitudesEnviadasLocal] = useState<Array<string>>(listaSolicitudesEnviadas ?? []);
  const [solicitudesRecibidasLocal, setSolicitudesRecibidasLocal] = useState<Array<string>>(listaSolicitudesRecibidas ?? []);
  const solicitudesEnviadasSet = new Set(solicitudesEnviadasLocal);
  const solicitudesRecibidasSet = new Set(solicitudesRecibidasLocal);

  useEffect(() => {
    setSolicitudesEnviadasLocal(listaSolicitudesEnviadas ?? []);
  }, [listaSolicitudesEnviadas]);

  useEffect(() => {
    setSolicitudesRecibidasLocal(listaSolicitudesRecibidas ?? []);
  }, [listaSolicitudesRecibidas]);

  const cargarDatos = useCallback(async () => {
    if (!nombreUsuario) {
      setData([]);
      return;
    }

    try {
      const idPerfil = await obtenerIdUsuario(nombreUsuario);
      setIdPerfilVisto(idPerfil ?? null);
      
      if (idPerfil) {
        const listaAmigosPerfil = (await obtenerListaAmigos(idPerfil)) as FriendApiItem[];
        const dataFormatted = (listaAmigosPerfil ?? [])
          .map((amigo: FriendApiItem, index: number) => {
            const idAmigo = amigo?.id ?? amigo?.id_amigo;
            const nombreAmigo = amigo?.nombre_usuario ?? amigo?.nombre_amigo;

            if (idAmigo === undefined || idAmigo === null) return null;

            return {
              key: `${idAmigo}-${index}`,
              amigo: nombreAmigo ? String(nombreAmigo) : `Usuario ${idAmigo}`,
              idAmigo,
            };
          })
          .filter((item: DataType | null): item is DataType => item !== null);

        setData(dataFormatted);
      }
      
      const miNombre = localStorage.getItem('nombre_usuario');
      if (miNombre) {
        setMiNombreLocal(miNombre);
        const miId = await obtenerIdUsuario(miNombre);
        setMiIdLocal(miId ?? null);

        if (miId) {
          const misAmigosAPI = (await obtenerListaAmigos(miId)) as FriendApiItem[];
          const idsDeMisAmigos = misAmigosAPI
            .map((a) => a.id ?? a.id_amigo)
            .filter((id): id is string | number => id !== undefined && id !== null)
            .map((id) => normalizarId(id));
          setMisAmigosIds(idsDeMisAmigos);
        }
      }

    } catch (error) {
      console.error('Error al obtener datos en TablaAmigos:', error);
      setData([]);
    }
  }, [nombreUsuario]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos, actualizarTrigger]);

  useEffect(() => {
    const manejarAmigoAceptado = (event: Event) => {
      const customEvent = event as CustomEvent<{ nombreAmigo?: string }>;
      const nombreAmigo = customEvent.detail?.nombreAmigo;

      if (!nombreAmigo) {
        return;
      }

      setData((prev) => {
        if (prev.some((item) => item.amigo === nombreAmigo)) {
          return prev;
        }

        return [
          ...prev,
          {
            key: `optimistic-${nombreAmigo}-${Date.now()}`,
            amigo: nombreAmigo,
            idAmigo: nombreAmigo,
          },
        ];
      });

      setMisAmigosIds((prev) => {
        if (prev.includes(normalizarId(nombreAmigo))) {
          return prev;
        }

        return [...prev, normalizarId(nombreAmigo)];
      });
    };

    window.addEventListener('amigo-aceptado', manejarAmigoAceptado);

    return () => {
      window.removeEventListener('amigo-aceptado', manejarAmigoAceptado);
    };
  }, []);

  const manejarEliminarAmigo = async (idAmigoAEliminar: string | number) => {
    const token = localStorage.getItem('token');

    if (!token || !miIdLocal) {
      console.error('No se pudo eliminar el amigo: falta token o id de usuario logueado.');
      return;
    }

    try {
      const respuesta = await eliminarAmigo(token, miIdLocal, idAmigoAEliminar);

      if (!respuesta.ok) throw new Error("Error en el servidor al eliminar");

      setData((prev) => prev.filter((item) => item.idAmigo !== idAmigoAEliminar));
      setMisAmigosIds((prev) => prev.filter((id) => id !== normalizarId(idAmigoAEliminar)));
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
    }
  };

  const manejarAceptarYRefrescar = async (nombreAmigo: string) => {
    if (!manejarAceptarSolicitud) {
      return;
    }

    await Promise.resolve(manejarAceptarSolicitud(nombreAmigo));
    window.location.reload();
  };

  const manejarRechazarYRefrescar = async (nombreAmigo: string) => {
    if (!manejarRechazarSolicitud) {
      return;
    }

    await Promise.resolve(manejarRechazarSolicitud(nombreAmigo));
    window.location.reload();
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Amigo',
      dataIndex: 'amigo',
      key: 'amigo',
      ellipsis: true,
      render: (text) => (
        <Link
          href={`/perfil?usuario=${encodeURIComponent(String(text))}`}
          className="block max-w-[12rem] truncate text-xs font-medium text-emerald-300 hover:text-emerald-200 hover:underline sm:max-w-none sm:text-sm"
        >
          {text}
        </Link>
      ),
    },
  ];


  
  if (mostarAgregar) {
    columns.push({
      title: '',
      key: 'agregar',
      render: (_, record) => {
        if (record.amigo === miNombreLocal) {
          return <span className="text-xs md:text-sm font-semibold text-emerald-300/80">Tú</span>;
        }
        
        if (misAmigosIds.includes(normalizarId(record.idAmigo))) {
          return (
            <div className="flex items-center flex-col md:flex-row gap-y-6 md:gap-x-3 md:justify-evenly">
              <span className="text-xs md:text-sm font-semibold text-emerald-300">Amigos</span>
              {manejarEnviarInvitacionPartida && (
                <BotonConIcono
                  variant="secondary"
                  texto="Invitar a partida"
                  ruta_icono="/assets/icons/chessKing.svg"
                  funcion={() => manejarEnviarInvitacionPartida(record.amigo.toString())}
                  className="flex-row flex items-center min-h-8 h-auto p-1"
                  tamanioIcon="h-5 w-5"
                />
              )}
            </div>
          );
        }
        
        if (solicitudesRecibidasSet.has(record.amigo)) {
          return(
            <div className='flex w-auto gap-x-3'>
              <BotonConIcono
                variant="agregar"
                texto=""
                ruta_icono="/assets/icons/agregar.svg"
                funcion={() => {
                  void manejarAceptarYRefrescar(record.amigo.toString());
                }}
                tamanioIcon="h-6 w-6"
              />

              <BotonConIcono
                variant="destructive"
                texto=""
                ruta_icono="/assets/icons/eliminar.svg"
                funcion={() => {
                  void manejarRechazarYRefrescar(record.amigo.toString());
                }}
                tamanioIcon="h-4 w-4"
              />
            </div>
          )
        }

        if (solicitudesEnviadasSet.has(record.amigo)) {
          return (
            <BotonConIcono
              variant="pendiente"
              texto=""
              ruta_icono="/assets/icons/pendiente.svg"
              funcion={() =>  manejarCancelarSolicitud && manejarCancelarSolicitud(record.amigo.toString())}
              tamanioIcon="h-5 w-5"
            />
          );
        }

        return (
          <BotonConIcono
            variant="agregar"
            texto=""
            ruta_icono="/assets/icons/agregar.svg"
            funcion={() => manejarEnviarSolicitud(record.amigo.toString())}
            tamanioIcon="h-6 w-6"
          />
        );
      },
    });
  }

  if (mostrarEliminar) {
    columns.push({
      title: 'Acción',
      key: 'eliminar',
      render: (_, record) => (
        <BotonConIcono
          variant="destructive"
          texto=""
          ruta_icono="/assets/icons/eliminar.svg"
          funcion={() => manejarEliminarAmigo(record.idAmigo)}
          tamanioIcon="h-4 w-4"
        />
      ),
    });
  }

  if (!nombreUsuario) {
    return <div>No se ha proporcionado un usuario.</div>;
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-amber-700/40 bg-slate-900/70 p-4 text-amber-100 shadow-2xl shadow-black/20 sm:p-5">
       <h2 className="mb-4 flex justify-center text-center text-lg font-bold break-words sm:justify-start sm:text-xl">Amigos de {nombreUsuario}</h2>
      {data.length === 0 ? (
        <div className="py-8">
          <Empty
            description={<span className="text-emerald-200/80">No tienes amigos agregados</span>}
          />
        </div>
      ) : (
        <Table<DataType>
          className="table-contrast"
          columns={columns}
          dataSource={data}
          showHeader={true}
          pagination={{ pageSize: 5, size: 'small' }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </div>
  );
}