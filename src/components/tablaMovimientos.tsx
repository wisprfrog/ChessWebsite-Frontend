'use client';

import React, { useEffect } from 'react';
import { Divider, Table } from 'antd';
const columns = [
  {
    title: '#',
    dataIndex: 'turno',
    align: "center" as const,
    width: '40px',
    render: (text: string) => <span className="text-slate-500 font-mono text-xs">{text}</span>
  },
  {
    title: 'Blancas',
    dataIndex: 'blancas',
    align: "left" as const,
    render: (text: string) => <span className="text-slate-300 font-mono text-xs sm:text-sm">{text}</span>
  },
  {
    title: 'Negras',
    dataIndex: 'negras',
    align: "right" as const,
    render: (text: string) => <span className="text-slate-300 font-mono text-xs sm:text-sm">{text}</span>
  },
];

const obtenerMovimientos = (lista_movimientos: string[]) => {
  const data = [];
  if (!lista_movimientos) return [];
  
  for (let i = 0; i < lista_movimientos.length; i += 2) {
    const numeroTurno = (i / 2 + 1).toString();
    
    data.unshift({
      key: numeroTurno,
      turno: numeroTurno,
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
    <div className='flex flex-col max-w-120 sm:max-w-64 md:max-w-80 lg:max-w-[480px] h-96 sm:h-[480px] md:h-[600px] lg:h-[570px] bg-slate-800 rounded-lg border-2 border-slate-700 p-4'>
        <style>{`
        .ant-table-placeholder {
          display: none !important;
        }
        .ant-table {
          font-size: 0.75rem;
        }
        @media (min-width: 640px) {
          .ant-table {
            font-size: 0.875rem;
          }
        }
        @media (min-width: 768px) {
          .ant-table {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className='w-full h-full flex flex-col flex-1 min-h-0 overflow-y-scroll scrollbar scrollbar-thumb-slate-600 scrollbar-track-slate-700'>
        <Table className="table-contrast flex-1 h-full w-full" 
               columns={columns}
               dataSource={data} 
               size="small"
               pagination={false} 
               scroll={{y: '100%'}}
        />
      </div>
    </div>
  );
}
