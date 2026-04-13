'use client'
import { useEffect, useState } from 'react';
import tailwindcss from "@tailwindcss/vite";
import { Table } from 'antd';
import { obtenerListaAmigos, obtenerIdUsuario } from "../services/api";

const columns = [
  { title: 'Nombre', dataIndex: 'id_amigo', key: 'id_amigo' },
  {
    title: 'Eliminar',
    dataIndex: '',
    key: 'x',
    render: () => <a>Eliminar amigo</a>,
  },
];

export default function TablaAmigos(){
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idUsuario = await obtenerIdUsuario(localStorage.getItem('nombre_usuario'));
                const lista = await obtenerListaAmigos(idUsuario);
                const dataFormatted = lista.map((id: any) => ({ key: id, id_amigo: id }));
                setDataSource(dataFormatted);
            } catch (error) {
                console.error('Error al obtener la lista de amigos:', error);
            }
        };

        fetchData();
    }, []);

    return(
        <div className="flex justify-center">
            <Table 
                className="w-1/2"
                columns={columns}
                scroll={{ y: 55 * 2 }}
                dataSource={dataSource}
            />
        </div>

    );
}