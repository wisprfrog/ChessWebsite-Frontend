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
  }, []);

  return (
    <div className="p-4">
      <h2>Estadísticas del jugador {nombreUsuario}</h2>
      <Table<DataType> 
        columns={columns} 
        dataSource={data} 
        showHeader={false}
        pagination={false}
      />
    </div>
  );
}