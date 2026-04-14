import { Button, Avatar, Empty } from 'antd';

const solicitudesFalsas = [
    { id: 1, nombre: 'GarryKasparov' },
    // { id: 2, nombre: 'MagnusC' },
    // { id: 3, nombre: 'BethHarmon' },
    // { id: 4, nombre: "Poco Loco" },
];

// const solicitudesFalsas: any [] = [];

export default function SideBar() {

    return (
        <div className="w-full md:w-96 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Solicitudes</h2>
                {solicitudesFalsas.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {solicitudesFalsas.length} nuevas
                    </span>
                )}
            </div>

            {solicitudesFalsas.length === 0 ? (
                
                <div className="py-8">
                    <Empty 
                        description={<span className="text-gray-500">No tienes solicitudes pendientes</span>} 
                    />
                </div>

            ) : (

                <ul className="flex flex-col">
                    {solicitudesFalsas.map((solicitud) => (
                        <li 
                            key={solicitud.id} 
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="bg-blue-500">{solicitud.nombre.charAt(0)}</Avatar>
                                <a 
                                    href={`/perfil?usuario=${solicitud.nombre}`} 
                                    className="font-medium text-gray-800 hover:text-blue-500 transition-colors"
                                >
                                    {solicitud.nombre}
                                </a>
                            </div>

                            <div className="flex gap-2">
                                <Button type="primary" size="small" key="aceptar">Aceptar</Button>
                                <Button danger size="small" key="rechazar">Rechazar</Button>
                            </div>
                        </li>
                    ))}
                </ul>
                
            )}
        </div>
    );
}