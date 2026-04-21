'use client';

import React, { useEffect } from 'react';
import { Divider, Table } from 'antd';
const columns = [
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
  console.log(lista_movimientos);
  if (!lista_movimientos) return [];
  for (let i = 0; i < lista_movimientos.length; i += 2) {
    data.unshift({
      key: (i / 2 + 1).toString(),
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
    <div className='w-full h-full flex flex-1 min-h-0 flex-col items-center justify-start'>
        {/*Quixa sea necesario cambiar el valor de scroll*/}
      <Table className="table-contrast flex-1 min-h-0 h-1/2" 
             columns={columns}
             dataSource={data} 
             size="medium" 
             pagination={false} 
             scroll={{y: '60vh'}}
      
      />
    </div>
  );
}
