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
    
    const { emitirAceptarSolicitudAmistad, emitirRechazarSolicitudAmistad, emitirEnviarSolicitudAmistad, emitirCancelarSolicitudAmistad } = useMonsterSocket(
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
    <main className="flex flex-col w-full min-h-screen bg-gray-50">
        <NavBar cuantasSolicitudesAmistad={numSolicitudes} />
        
        {/* Contenedor principal a dos columnas */}
        <div className="flex-grow flex flex-col md:flex-row p-6 max-w-7xl mx-auto w-full gap-6">
            
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">Amigos de {nombreUsuario}</h2>
                
                <TablaAmigos
                    manejarEnviarSolicitud={manejarEnviarSolicitudAmistad}
                    manejarCancelarSolicitud={null}
                    manejarAceptarSolicitud={manejarAceptarSolicitudAmistad}
                    manejarRechazarSolicitud={manejarRechazarSolicitudAmistad}
                    listaSolicitudesRecibidas={solicitudesAmistadRecibidas}
                    listaSolicitudesEnviadas={solicitudesAmistadEnviadas}
                    actualizarTrigger={actualizarTabla}
                    nombreUsuario={nombreUsuario}
                />
                
            </div>

            <div className="md:w-96 flex flex-col gap-6">
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