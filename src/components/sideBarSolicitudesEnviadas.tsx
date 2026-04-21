import { Button, Avatar, Empty } from 'antd';

export default function SideBarEnviadas({ solicitudesEnviadas, cancelarSolicitud }: { solicitudesEnviadas: Array<string>; cancelarSolicitud: ((nombre_usuario: string) => void) | null }) {
    return (
        <div className="w-full md:w-96 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Solicitudes enviadas</h2>
                {solicitudesEnviadas.length > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {solicitudesEnviadas.length} en espera
                    </span>
                )}
            </div>

            {solicitudesEnviadas.length === 0 ? (
                
                <div className="py-8">
                    <Empty 
                        description={<span className="text-gray-500">No tienes solicitudes enviadas</span>} 
                    />
                </div>

            ) : (
                <ul className="flex flex-col">
                    {Array.from(solicitudesEnviadas).map((nombre_usuario_solicitud) => (
                        <li 
                        key={nombre_usuario_solicitud} 
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="bg-blue-500">{nombre_usuario_solicitud[0]}</Avatar>
                                <a 
                                    href={`/perfil?usuario=${nombre_usuario_solicitud}`} 
                                    className="font-medium text-gray-800 hover:text-blue-500 transition-colors"
                                >
                                    {nombre_usuario_solicitud}
                                </a>
                            </div>

                            <div className="flex gap-2">
                                <Button danger size="small" key="cancelar" onClick={() => cancelarSolicitud && cancelarSolicitud(nombre_usuario_solicitud)}>
                                    Cancelar
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
                
            )}
        </div>
    );
}