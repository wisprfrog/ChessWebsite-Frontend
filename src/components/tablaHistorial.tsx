"use client";

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { obtenerHistorialCompleto } from '@/services/api';
import Link from 'next/link';

interface DataType {
  key: string;
  idPartida: string;
  jugadores: string;
  fecha: string;
  ganador: string;
}

interface TablaHistorialProps {
  nombreUsuario: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Jugadores',
    dataIndex: 'jugadores',
    key: 'jugadores',
    render: (text, record) => (
      <Link 
        href={`/partida_ajedrez?tipo_partida=repeticion&id_partida=${encodeURIComponent(record.idPartida)}`}
        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
      >
        {text}
      </Link>
    ), 
  },
  {
    title: 'Fecha',
    dataIndex: 'fecha',
    key: 'fecha',
  },
  {
    title: 'Ganador',
    dataIndex: 'ganador',
    key: 'ganador'
  }
];

export default function TablaHistorial({ nombreUsuario } : TablaHistorialProps) {

  const [data, setData] = useState<DataType[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      try {
        const partidas = await obtenerHistorialCompleto(nombreUsuario);

        if (partidas && partidas.length > 0) {
          const dataFormatted = partidas.map((partida: any, index: number) => ({
            key: partida.id_partida ? String(partida.id_partida) : String(index),
            idPartida: partida.id_partida ? String(partida.id_partida) : String(index),
            jugadores: `${partida.blancas} vs ${partida.negras}`, 
            fecha: partida.fecha || 'Fecha no disponible',
            ganador: partida.ganador || 'Empate/En curso'
          }));
          
          setData(dataFormatted);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error al cargar la tabla de historial:', error);
      } finally {
        setCargando(false);
      }
    };

    if (nombreUsuario) {
      fetchData();
    }
  }, [nombreUsuario]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 w-full h-full">
      <h2 className="text-xl font-bold mb-4">Historial de Partidas</h2>
      <Table<DataType> 
        columns={columns} 
        dataSource={data} 
        showHeader={true}
        loading={cargando}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}