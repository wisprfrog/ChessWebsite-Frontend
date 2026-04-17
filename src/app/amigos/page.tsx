'use client'

import { useEffect, useState } from "react";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";
import SideBar from "../../components/sideBar";
import TablaAmigos from "@/components/tablaAmigos";


export default function PaginaAmigos() {
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

    useEffect(() => {
        setNombreUsuario(localStorage.getItem('nombre_usuario'));
    }, []);

    if (nombreUsuario === null) {
        return null;
    }

    return(
    <main className="flex flex-col w-full min-h-screen bg-gray-50">
        <NavBar />
        
        {/* Contenedor principal a dos columnas */}
        <div className="flex-grow flex flex-col md:flex-row p-6 max-w-7xl mx-auto w-full gap-6">
            
            {/* COLUMNA IZQUIERDA: Mis Amigos (Ocupa el espacio sobrante con flex-1) */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">Amigos de {nombreUsuario}</h2>
                
                <TablaAmigos nombreUsuario={nombreUsuario} />
                
            </div>

            <SideBar ></SideBar>

            

        </div>

        <Footer />
    </main>
    );
}