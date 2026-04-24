import { Button, Avatar, Empty } from 'antd';

export default function SideBarRecibidas({ solicitudesAmistad, aceptarSolicitudAmistad, rechazarSolicitudAmistad }: { solicitudesAmistad: Array<string>; aceptarSolicitudAmistad: ((nombre_usuario: string) => void) | null; rechazarSolicitudAmistad: ((nombre_usuario: string) => void) | null }) {
    return (
        <div className="h-fit w-full flex-col shrink-0 rounded-lg border border-sky-900/60 bg-slate-900/70 p-4 shadow-2xl shadow-black/20 sm:p-6">
                
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-emerald-100 sm:text-xl">Solicitudes recibidas</h2>
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
                    {Array.from(solicitudesAmistad).map((nombre_usuario_solicitud, index) => (
                        <li 
                        key={nombre_usuario_solicitud} 
                        className={`flex flex-col gap-3 border-b border-emerald-900/50 px-3 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between ${index % 2 === 0 ? 'bg-slate-950/25' : 'bg-slate-900/10'}`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <Avatar className="bg-blue-500">{nombre_usuario_solicitud[0]}</Avatar>
                                <a 
                                    href={`/perfil?usuario=${nombre_usuario_solicitud}`} 
                                    className="truncate font-medium text-emerald-100 transition-colors hover:text-emerald-300"
                                >
                                    {nombre_usuario_solicitud}
                                </a>
                            </div>

                            <div className="flex flex-wrap gap-5 md:justify-end justify-center">
                                <Button type="primary" color="cyan" size="small" key="aceptar" onClick={() => aceptarSolicitudAmistad && aceptarSolicitudAmistad(nombre_usuario_solicitud)}>
                                    Aceptar
                                </Button>
                                <Button type="primary" danger size="small" key="rechazar" onClick={() => rechazarSolicitudAmistad && rechazarSolicitudAmistad(nombre_usuario_solicitud)}>
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