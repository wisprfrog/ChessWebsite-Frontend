'use client';

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import Link from 'next/link';
import { eliminarAmigo, agregarAmigo, obtenerListaAmigos, obtenerIdUsuario } from '@/services/api';
import BotonConIcono from './boton';

interface DataType {
  key: string;
  amigo: string;
  idAmigo: string | number;
}

interface FriendApiItem {
  id?: string | number;
  id_amigo?: string | number;
  nombre_usuario?: string;
  nombre_amigo?: string;
}

interface TablaAmigosProps {
  manejarEnviarSolicitud: (nombre_usuario_destino: string) => void;
  manejarCancelarSolicitud: ((nombre_usuario_destino: string) => void) | null;
  listaSolicitudesEnviadas: Array<string> | null;
  nombreUsuario?: string | null;
  mostrarEliminar?: boolean;
  mostarAgregar?: boolean;
  actualizarTrigger?: number;
}

export default function TablaAmigos({ manejarEnviarSolicitud, manejarCancelarSolicitud, listaSolicitudesEnviadas, nombreUsuario, mostrarEliminar = true, mostarAgregar = true, actualizarTrigger = 0 }: TablaAmigosProps) {
  const [data, setData] = useState<DataType[]>([]);
  
  const [idPerfilVisto, setIdPerfilVisto] = useState<string | number | null>(null);

  const [miNombreLocal, setMiNombreLocal] = useState<string | null>(null);
  const [miIdLocal, setMiIdLocal] = useState<string | number | null>(null);
  const [misAmigosIds, setMisAmigosIds] = useState<(string | number)[]>([]);
  const solicitudesEnviadasSet = new Set(listaSolicitudesEnviadas ?? []);

  useEffect(() => {
    const fetchData = async () => {
      if (!nombreUsuario) {
        setData([]);
        return;
      }

      try {
        console.log('TablaAmigos: Cargando amigos para:', nombreUsuario, 'Trigger:', actualizarTrigger);
        const idPerfil = await obtenerIdUsuario(nombreUsuario);
        setIdPerfilVisto(idPerfil ?? null);
        
        if (idPerfil) {
          const listaAmigosPerfil = (await obtenerListaAmigos(idPerfil)) as FriendApiItem[];
          console.log('TablaAmigos: Amigos obtenidos:', listaAmigosPerfil);
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
            const idsDeMisAmigos = misAmigosAPI.map(a => a.id ?? a.id_amigo).filter(id => id !== undefined) as (string | number)[];
            setMisAmigosIds(idsDeMisAmigos);
          }
        }

      } catch (error) {
        console.error('Error al obtener datos en TablaAmigos:', error);
        setData([]);
      }
    };

    fetchData();
  }, [nombreUsuario, actualizarTrigger]);

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
        if (prev.includes(nombreAmigo)) {
          return prev;
        }

        return [...prev, nombreAmigo];
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
      setMisAmigosIds((prev) => prev.filter((id) => id !== idAmigoAEliminar));
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
    }
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Amigo',
      dataIndex: 'amigo',
      key: 'amigo',
      render: (text) => (
        <Link
          href={`/perfil?usuario=${encodeURIComponent(String(text))}`}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          {text}
        </Link>
      ),
    },
  ];

  if (mostrarEliminar) {
    columns.push({
      title: 'Eliminar',
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

  if (mostarAgregar) {
    columns.push({
      title: 'Acción',
      key: 'agregar',
      render: (_, record) => {
        if (record.amigo === miNombreLocal) {
          return <span className="text-gray-400 text-sm font-semibold">Tú</span>;
        }

        if (misAmigosIds.includes(record.idAmigo)) {
          return <span className="text-green-600 text-sm font-semibold">Amigos</span>;
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

  if (!nombreUsuario) {
    return <div>No se ha proporcionado un usuario.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 w-full h-full">
      <Table<DataType>
        columns={columns}
        dataSource={data}
        showHeader={true}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}