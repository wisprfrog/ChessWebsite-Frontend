'use client'

import { useEffect, useState } from "react";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";
import SideBarRecibidas from "../../components/sideBarSolicitudesRecibidas";
import TablaAmigos from "@/components/tablaAmigos";
import { useMonsterSocket } from "../../hooks/usarSocketMonster";
import SideBarEnviadas from "../../components/sideBarSolicitudesEnviadas";

export default function PaginaAmigos() {
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
    const [numSolicitudes, setNumSolicitudes] = useState(0);
    const [solicitudesAmistadRecibidas, setSolicitudesAmistadRecibidas] = useState<Array<string>>([]);
    const [solicitudesAmistadEnviadas, setSolicitudesAmistadEnviadas] = useState<Array<string>>([]);
    const [actualizarTabla, setActualizarTabla] = useState(0);

    useEffect(() => {
        setNombreUsuario(localStorage.getItem('nombre_usuario'));
    }, []);
    
    function mostrarSolicitudes(solicitudes : Array<string>) {
        setNumSolicitudes(solicitudes.length);
    }
    
    function cargarSolicitudes(solicitudes : Array<string>) {
        setSolicitudesAmistadRecibidas(solicitudes);
    }

    function cargarSolicitudesEnviadas(solicitudes : Array<string>) {
        setSolicitudesAmistadEnviadas(solicitudes);
    }
    
    const { emitirAceptarSolicitudAmistad, emitirRechazarSolicitudAmistad, emitirEnviarSolicitudAmistad, emitirCancelarSolicitudAmistad, emitirEnviarInvitacionPartida } = useMonsterSocket(
        {
            manejarNuevaNotificacion: mostrarSolicitudes,
            manejarCargarSolicitudesAmistad: cargarSolicitudes,
            manejarCargarSolicitudesEnviadas: cargarSolicitudesEnviadas
        }
    );

    const manejarEnviarSolicitudAmistad = (nombre_usuario_destino : string) => {

        emitirEnviarSolicitudAmistad(nombre_usuario_destino);
        setSolicitudesAmistadEnviadas((prev) => prev.includes(nombre_usuario_destino) ? prev : [...prev, nombre_usuario_destino]);
    }

    const manejarAceptarSolicitudAmistad = (nombre_usuario_origen : string) => {
        emitirAceptarSolicitudAmistad(nombre_usuario_origen);
        setSolicitudesAmistadRecibidas((prev) => prev.filter(solicitud => solicitud !== nombre_usuario_origen));
        setNumSolicitudes((prev) => Math.max(0, prev - 1));
        window.dispatchEvent(new CustomEvent('amigo-aceptado', {
            detail: { nombreAmigo: nombre_usuario_origen }
        }));
        setTimeout(() => {
            setActualizarTabla(prev => prev + 1);
        }, 500);
    }

    const manejarRechazarSolicitudAmistad = (nombre_usuario_origen : string) => {
        emitirRechazarSolicitudAmistad(nombre_usuario_origen);
        setSolicitudesAmistadRecibidas((prev) => prev.filter(solicitud => solicitud !== nombre_usuario_origen));
        setNumSolicitudes((prev) => Math.max(0, prev - 1));
        setSolicitudesAmistadEnviadas((prev) => prev.filter(solicitud => solicitud !== nombre_usuario_origen));
    }

    if (nombreUsuario === null) {
        return null;
    }

    return(
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-slate-950 via-amber-900 to-blue-950">
        <NavBar cuantasSolicitudesAmistad={numSolicitudes} />
        
        {/* Contenedor principal a dos columnas */}
        <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row">
            
                
            <TablaAmigos
                manejarEnviarSolicitud={manejarEnviarSolicitudAmistad}
                manejarCancelarSolicitud={null}
                    manejarAceptarSolicitud={manejarAceptarSolicitudAmistad}
                    manejarRechazarSolicitud={manejarRechazarSolicitudAmistad}
                    manejarEnviarInvitacionPartida={emitirEnviarInvitacionPartida}
                    listaSolicitudesRecibidas={solicitudesAmistadRecibidas}
                listaSolicitudesEnviadas={solicitudesAmistadEnviadas}
                actualizarTrigger={actualizarTabla}
                nombreUsuario={nombreUsuario}
            />
                
            

            <div className="flex w-full shrink-0 flex-col gap-5 sm:gap-6 lg:w-[22rem]">
                <SideBarRecibidas
                    solicitudesAmistad={solicitudesAmistadRecibidas}
                    aceptarSolicitudAmistad={manejarAceptarSolicitudAmistad}
                    rechazarSolicitudAmistad={manejarRechazarSolicitudAmistad}
                />
                <SideBarEnviadas
                    solicitudesEnviadas={solicitudesAmistadEnviadas}
                    cancelarSolicitud={emitirCancelarSolicitudAmistad}
                />
            </div>

        </div>

        <Footer />
    </main>
    );
}