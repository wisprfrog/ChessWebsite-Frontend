'use client';

import React, { useEffect } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useSearchParams } from 'next/navigation';
import { eliminarAmigo, obtenerListaAmigos, obtenerIdUsuario } from '@/services/api';
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

export default function TablaAmigos() {

  const searchParams = useSearchParams();
  const nombreUsuario = searchParams.get('usuario');
  const [data, setData] = React.useState<DataType[]>([]);
  const [idUsuarioActual, setIdUsuarioActual] = React.useState<string | number | null>(null);

  const manejarEliminarAmigo = async (idAmigo: string | number) => {
    const token = localStorage.getItem('token');

    if (!token || !idUsuarioActual) {
      console.error('No se pudo eliminar el amigo: falta token o id de usuario.');
      return;
    }

    try {
      const respuesta = await eliminarAmigo(token, idUsuarioActual, idAmigo);

      if (!respuesta.ok) {
        console.error('No se pudo eliminar el amigo.');
        return;
      }

      setData((prev) => prev.filter((item) => item.idAmigo !== idAmigo));
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
    }
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Amigo',
      dataIndex: 'amigo',
      key: 'amigo',
      render: (text) => <strong>{text}</strong>,
    },
    {
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
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!nombreUsuario) {
        setData([]);
        return;
      }

      try {
        const idUsuario = await obtenerIdUsuario(searchParams.get('usuario') ?? '');
        setIdUsuarioActual(idUsuario ?? null);
        const listaAmigos = (await obtenerListaAmigos(idUsuario)) as FriendApiItem[];

        const dataFormatted = (listaAmigos ?? [])
          .map((amigo: FriendApiItem, index: number) => {
            const idAmigo = amigo?.id ?? amigo?.id_amigo;
            const nombreAmigo = amigo?.nombre_usuario ?? amigo?.nombre_amigo;

            if (idAmigo === undefined || idAmigo === null) {
              return null;
            }

            return {
              key: `${idAmigo}-${index}`,
              amigo: nombreAmigo ? String(nombreAmigo) : `Usuario ${idAmigo}`,
              idAmigo,
            };
          })
          .filter((item: DataType | null): item is DataType => item !== null);

        setData(dataFormatted);
      } catch (error) {
        console.error('Error al obtener la lista de amigos:', error);
        setData([]);
      }
    };

    fetchData();
  }, [nombreUsuario]);

  if (!nombreUsuario) {
    return <div>No se ha proporcionado un usuario.</div>;
  }

  return (
    <div className="p-4">
      <Table<DataType>
        columns={columns}
        dataSource={data}
        showHeader={false}
        pagination={false}
      />
    </div>
  );
}
    