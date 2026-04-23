'use client';

import React, { useEffect } from 'react';
import { Divider, Table } from 'antd';
const columns = [
  {
    title: '#',
    dataIndex: 'turno',
    align: "center" as const,
    width: '50px', // Hacemos la columna estrecha
    render: (text: string) => <span className="text-slate-500 font-mono text-xs">{text}</span>
  },
  {
    title: 'Movimientos Blancas',
    dataIndex: 'blancas',
    align: "left" as const,
  },
  {
    title: 'Movimientos Negras',
    dataIndex: 'negras',
    align: "right" as const,
  },
];
/*
const data = [
  {
    key: '1',
    blancas: 'e4',
    negras: 'e5',
  },
  {
    key: '2',
    blancas: 'd4',
    negras: 'd5',
  },
  {
    key: '3',
    blancas: 'Nf3',
    negras: 'Nf6',
  },
];
*/

const obtenerMovimientos = (lista_movimientos: string[]) => {
  const data = [];
  if (!lista_movimientos) return [];
  
  for (let i = 0; i < lista_movimientos.length; i += 2) {
    const numeroTurno = (i / 2 + 1).toString();
    
    // Como usas unshift(), el movimiento más reciente aparecerá arriba.
    // Ahora con los números será muy evidente: (ej. 10., 9., 8....)
    data.unshift({
      key: numeroTurno,
      turno: numeroTurno, // Formato "1.", "2.", etc.
      blancas: lista_movimientos[i],
      negras: lista_movimientos[i + 1] ? lista_movimientos[i + 1] : '',
    });
  }
  return data;
};

export default function TablaMovimientos({ lista_movimientos }: { lista_movimientos: string[] }) {
    useEffect(() => {
  console.log("Lista de movimientos actualizada:", lista_movimientos);
    }, [lista_movimientos]);
    const data = obtenerMovimientos(lista_movimientos); 

  return (
    <div className='w-full h-full flex flex-col flex-1 min-h-0 overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-red-100 bg-slate-800 rounded-lg'>
        {/*Quixa sea necesario cambiar el valor de scroll*/}
        <style>{`
        .ant-table-placeholder {
          display: none !important;
        }
      `}</style>
      <Table className="table-contrast flex-1 h-full w-full" 
             columns={columns}
             dataSource={data} 
             size="large" 
             pagination={false} 
             scroll={{y: '60vh'}}
      />
    </div>
  );
}
