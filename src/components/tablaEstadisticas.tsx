"use client";

import React, { useEffect } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { obtenerEstadisticasUsuario, obtenerIdUsuario } from '@/services/api';

interface DataType {
  key: string;
  metrica: string;
  valor: number;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Estadística',
    dataIndex: 'metrica',
    key: 'metrica',

    render: (text) => <strong>{text}</strong>, 
  },
  {
    title: 'Valor',
    dataIndex: 'valor',
    key: 'valor',
  },
];

export default function TablaEstadisticas({nombreUsuario} : {nombreUsuario: string}) {

  const [data, setData] = React.useState<DataType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try{
        const idUsuario = await obtenerIdUsuario(nombreUsuario);
        const estadistica = await obtenerEstadisticasUsuario(idUsuario);

        if(estadistica){
          const dataFormatted = [
            { key: '1', metrica: 'Partidas Jugadas', valor: estadistica.partidas_jug },
            { key: '2', metrica: 'Partidas Ganadas', valor: estadistica.ganadas },
            { key: '3', metrica: 'Partidas Perdidas', valor: estadistica.perdidas },
            { key: '4', metrica: 'Partidas Empatadas', valor: estadistica.tablas },
          ];
          setData(dataFormatted);
        }
        else{
          setData([]);
        }
      }catch (error){
        console.error('Error al obtener las estadísticas:', error);
      }
    };
    fetchData();
  }, [nombreUsuario]);

  return (
    <div className="flex w-full min-w-0 flex-col rounded-lg border border-amber-700/40 bg-slate-900/70 p-3 text-amber-100 shadow-2xl shadow-black/20 sm:p-4">
      <h2 className='mb-3 text-center text-base font-bold break-words sm:mb-4 sm:text-left sm:text-lg'>Estadísticas del jugador {nombreUsuario}</h2>
      <Table<DataType> 
        className="table-contrast h-full w-full"
        columns={columns} 
        dataSource={data} 
        showHeader={false}
        pagination={false}
        size="small"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}