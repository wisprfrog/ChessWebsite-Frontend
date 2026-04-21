import { Button, Avatar, Empty } from 'antd';

export default function SideBarRecibidas({ solicitudesAmistad, aceptarSolicitudAmistad, rechazarSolicitudAmistad }: { solicitudesAmistad: Array<string>; aceptarSolicitudAmistad: ((nombre_usuario: string) => void) | null; rechazarSolicitudAmistad: ((nombre_usuario: string) => void) | null }) {
    return (
        <div className="w-full md:w-96 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Solicitudes recibidas</h2>
                {solicitudesAmistad.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {solicitudesAmistad.length} nuevas
                    </span>
                )}
            </div>

            {solicitudesAmistad.length === 0 ? (
                
                <div className="py-8">
                    <Empty 
                        description={<span className="text-gray-500">No tienes solicitudes pendientes</span>} 
                    />
                </div>

            ) : (
                <ul className="flex flex-col">
                    {Array.from(solicitudesAmistad).map((nombre_usuario_solicitud) => (
                        <li 
                        key={nombre_usuario_solicitud} 
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="bg-blue-500">{nombre_usuario_solicitud.charAt(0)}</Avatar>
                                <a 
                                    href={`/perfil?usuario=${nombre_usuario_solicitud}`} 
                                    className="font-medium text-gray-800 hover:text-blue-500 transition-colors"
                                >
                                    {nombre_usuario_solicitud}
                                </a>
                            </div>

                            <div className="flex gap-2">
                                <Button type="primary" size="small" key="aceptar" onClick={() => aceptarSolicitudAmistad && aceptarSolicitudAmistad(nombre_usuario_solicitud)}>
                                    Aceptar
                                </Button>
                                <Button danger size="small" key="rechazar" onClick={() => rechazarSolicitudAmistad && rechazarSolicitudAmistad(nombre_usuario_solicitud)}>
                                    Rechazar
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
                
            )}
        </div>
    );
}