'use client'
export default function Footer() {

    return (
    <footer className='m-0 flex w-full flex-col items-center justify-start gap-y-8 border-t border-sky-700/60 bg-slate-950 text-emerald-50 p-6 md:p-8'>
        <div className='w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10'>
            <p className="text-center text-sm md:text-base text-white">Universidad Autonoma del Estado de Hidalgo</p>
            <p className="text-center text-sm md:text-base text-white">Licenciatura en Ciencias Computacionales</p>
            <p className="text-center text-sm md:text-base text-white">Bases de datos distribuidas</p>
            <p className="text-center font-bold text-sm md:text-base text-white">6°1</p>
        </div>
        <div className='w-full flex flex-col md:flex-row flex-wrap justify-center items-center gap-3 md:gap-4'>
            <p className="text-center text-sm text-white">Mauricio Daniel Manzanilla Hornung</p>
            <p className="text-center text-sm text-white">Brandom Galder Hernandez Franco</p>
            <p className="text-center text-sm text-white">Felipe de Jesus Orta Escobar</p>
            <p className="text-center text-sm text-white">Mario André Lozada Alfaro</p>
        </div>
    </footer>
    );
}