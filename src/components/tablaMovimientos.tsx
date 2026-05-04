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
    const data = obtenerMovimientos(lista_movimientos); 

 return (
    <div className='flex flex-col flex-1 w-full h-full bg-slate-800 rounded-lg border-2 border-slate-700 p-2 overflow-hidden min-h-0 relative'>
        <style>{`
        .ant-table-placeholder {
          display: none !important;
        }
        .ant-table {
          font-size: 0.75rem;
          background: transparent !important;
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

        /* --- EL TRUCO INFALIBLE: SCROLL NATIVO CON CABECERA FIJA --- */
        /* Hacemos que la cabecera flote sobre los movimientos */
        .ant-table-thead > tr > th {
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
          background-color: #1e293b !important; /* Mismo color bg-slate-800 para ocultar lo que pasa por debajo */
        }
        
        /* Limpiamos la decoración extra de la tabla */
        .ant-table-cell::before {
          display: none !important;
        }
        .ant-table-wrapper .ant-table-tbody > tr > td {
          border-bottom: 1px solid #334155; /* slate-700 */
        }

        /* --- BARRA DE SCROLL PERSONALIZADA --- */
        .scroll-container::-webkit-scrollbar {
          width: 8px;
        }
        .scroll-container::-webkit-scrollbar-track {
          background: #1e293b; /* slate-800 */
          border-radius: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background: #475569; /* slate-600 */
          border-radius: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: #64748b; /* slate-500 */
        }
      `}</style>
      
      <div className='w-full flex-1 min-h-0 overflow-y-auto scroll-container'>
        <Table className="table-contrast w-full" 
               columns={columns}
               dataSource={data} 
               size="small"
               pagination={false} 
        />
      </div>
    </div>
  );
}
