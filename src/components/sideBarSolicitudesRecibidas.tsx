import { Button, Avatar, Empty } from 'antd';

export default function SideBarRecibidas({ solicitudesAmistad, aceptarSolicitudAmistad, rechazarSolicitudAmistad }: { solicitudesAmistad: Array<string>; aceptarSolicitudAmistad: ((nombre_usuario: string) => void) | null; rechazarSolicitudAmistad: ((nombre_usuario: string) => void) | null }) {
    return (
        <div className="h-fit w-full rounded-lg border border-sky-900/60 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 md:w-96">
                
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-emerald-100">Solicitudes recibidas</h2>
                {solicitudesAmistad.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {solicitudesAmistad.length} nuevas
                    </span>
                )}
            </div>

            {solicitudesAmistad.length === 0 ? (
                
                <div className="py-8">
                    <Empty 
                        description={<span className="text-emerald-200/80">No tienes solicitudes pendientes</span>} 
                    />
                </div>

            ) : (
                <ul className="flex flex-col">
                    {Array.from(solicitudesAmistad).map((nombre_usuario_solicitud) => (
                        <li 
                        key={nombre_usuario_solicitud} 
                        className="flex items-center justify-between border-b border-emerald-900/50 py-3 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="bg-blue-500">{nombre_usuario_solicitud[0]}</Avatar>
                                <a 
                                    href={`/perfil?usuario=${nombre_usuario_solicitud}`} 
                                    className="font-medium text-emerald-100 transition-colors hover:text-emerald-300"
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