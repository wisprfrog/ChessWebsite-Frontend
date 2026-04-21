import { Button, Avatar, Empty } from 'antd';

type SolicitudEnviada = string | { nombre_usuario: string };

const obtenerNombreUsuario = (solicitud: SolicitudEnviada) => {
    if (typeof solicitud === 'string') {
        return solicitud;
    }

    return solicitud?.nombre_usuario ?? '';
};

export default function SideBarEnviadas({ solicitudesEnviadas, cancelarSolicitud }: { solicitudesEnviadas: Array<SolicitudEnviada>; cancelarSolicitud: ((nombre_usuario: string) => void) | null }) {
    return (
        <div className="h-fit w-full flex-col shrink-0 rounded-lg border border-sky-900/60 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
                
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-bold text-emerald-100">Solicitudes enviadas</h2>
                {solicitudesEnviadas.length > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {solicitudesEnviadas.length} en espera
                    </span>
                )}
            </div>

            {solicitudesEnviadas.length === 0 ? (
                
                <div className="py-8">
                    <Empty 
                        description={<span className="text-emerald-200/80">No tienes solicitudes enviadas</span>} 
                    />
                </div>

            ) : (
                <ul className="flex flex-col">
                    {Array.from(solicitudesEnviadas).map((solicitud, index) => {
                        const nombreUsuario = obtenerNombreUsuario(solicitud);
                        if (!nombreUsuario) return null;

                        return (
                        <li 
                        key={`${nombreUsuario}-${index}`} 
                        className={`flex items-center justify-between border-b border-emerald-900/50 px-3 py-3 last:border-0 ${index % 2 === 0 ? 'bg-slate-950/25' : 'bg-slate-900/10'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="bg-blue-500">{nombreUsuario[0]}</Avatar>
                                <a 
                                    href={`/perfil?usuario=${nombreUsuario}`} 
                                    className="font-medium text-emerald-100 transition-colors hover:text-emerald-300"
                                >
                                    {nombreUsuario}
                                </a>
                            </div>

                            <div className="flex gap-2">
                                <Button danger size="small" key="cancelar" onClick={() => cancelarSolicitud && cancelarSolicitud(nombreUsuario)}>
                                    Cancelar
                                </Button>
                            </div>
                        </li>
                        );
                    })}
                </ul>
                
            )}
        </div>
    );
}