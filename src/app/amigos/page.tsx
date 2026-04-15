'use client'

import NavBar from "../../components/navBar";
import Footer from "../../components/footer";
import SideBar from "../../components/sideBar";
import TablaAmigos from "@/components/tablaAmigos";
import { useSearchParams } from "next/navigation";


export default function PaginaAmigos() {

    const searchParams = useSearchParams();
    const nombreUsuario = searchParams.get('usuario');

    return(
    <main className="flex flex-col w-full min-h-screen bg-gray-50">
        <NavBar />
        
        {/* Contenedor principal a dos columnas */}
        <div className="flex-grow flex flex-col md:flex-row p-6 max-w-7xl mx-auto w-full gap-6">
            
            {/* COLUMNA IZQUIERDA: Mis Amigos (Ocupa el espacio sobrante con flex-1) */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">Amigos de {nombreUsuario}</h2>
                
                {/* Aquí podrás descomentar tu tabla cuando la tengas lista */}
                <TablaAmigos/>
                
            </div>

            <SideBar ></SideBar>

            

        </div>

        <Footer />
    </main>
    );
}