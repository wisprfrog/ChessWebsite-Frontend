'use client'
import TablaAmigos from "../../components/tablaAmigos";
import tailwindcss from "@tailwindcss/vite";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";

export default function PaginaAmigos() {
    return(
    <main className="flex flex-col w-full min-h-screen justify-start items-stretch">
        <NavBar />
        <div className="flex flex-col mb-5 bg-gray-100 p-5 rounded-lg">
            <TablaAmigos />
        </div>
        <Footer />
    </main>
    );
}