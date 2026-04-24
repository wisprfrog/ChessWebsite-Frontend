'use client';

import React, { useEffect } from 'react';
import { Table } from 'antd';

const MAX_TABLE_HEIGHT_PX = 230;
const TABLE_HEADER_HEIGHT_PX = 40;
const TABLE_SCROLL_HEIGHT_PX = MAX_TABLE_HEIGHT_PX - TABLE_HEADER_HEIGHT_PX;

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
  }
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
    // Aseguramos que el contenedor use h-full y flex-1
    <div className='flex flex-col flex-1 w-full h-full bg-slate-800 rounded-lg border-2 border-slate-700 p-2 overflow-hidden min-h-0'>
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
        /* Magia para que la tabla de Ant Design respete el flexbox */
        .ant-table-wrapper, .ant-spin-nested-loading, .ant-spin-container, .ant-table-container {
          height: 100% !important;
          display: flex;
          flex-direction: column;
        }
        .ant-table-body {
          flex: 1;
        }
      `}</style>
      
      <div className='w-full h-full flex flex-col min-h-0 flex-1'>
        <Table className="table-contrast w-full h-full flex-1" 
               columns={columns}
               dataSource={data} 
               size="small"
               pagination={false} 
               scroll={{ y: '100%' }} 
        />
      </div>
    </div>
  );
}
