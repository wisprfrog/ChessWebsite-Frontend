'use client'

// import TablaAmigos from "../../components/tablaAmigos";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";
import SideBar from "../../components/sideBar";

export default function PaginaAmigos() {
    return(
    <main className="flex flex-col w-full min-h-screen bg-gray-50">
        <NavBar />
        
        {/* Contenedor principal a dos columnas */}
        <div className="flex-grow flex flex-col md:flex-row p-6 max-w-7xl mx-auto w-full gap-6">
            
            {/* COLUMNA IZQUIERDA: Mis Amigos (Ocupa el espacio sobrante con flex-1) */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">Mis Amigos</h2>
                
                {/* Aquí podrás descomentar tu tabla cuando la tengas lista */}
                {/* <TablaAmigos /> */}
                
                <p className="text-gray-500 italic">Aquí aparecerá tu lista de amigos...</p>
            </div>

            <SideBar ></SideBar>

            

        </div>

        <Footer />
    </main>
    );
}