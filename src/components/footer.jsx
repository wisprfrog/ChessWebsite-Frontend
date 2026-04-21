'use client'
export default function Footer() {

    return (
    <footer className='m-0 flex h-content w-full flex-col items-center justify-start gap-y-5 border-t border-sky-700/60 bg-slate-950 text-emerald-50 p-5'>
        <div className='w-full h-content flex justify-center items-between gap-x-30'>
            <p className="h-content text-sm text-emerald-100">Universidad Autonoma del Estado de Hidalgo</p>
            <p className="h-content text-sm text-emerald-100">Licenciatura en Ciencias Computacionales</p>
            <p className="h-content text-sm text-emerald-100">Bases de datos distribuidas</p>
            <p className="h-content text-sm text-emerald-100">6° 1</p>
        </div>
        <div className='w-full h-content flex justify-center items-between gap-x-5'>
            <p className="h-content text-sm text-emerald-100">Mauricio Daniel Manzanilla Hornung</p>
            <p className="h-content text-sm text-sky-300">|</p>
            <p className="h-content text-sm text-emerald-100">Brandom Galder Hernandez Franco</p>
            <p className="h-content text-sm text-sky-300">|</p>
            <p className="h-content text-sm text-emerald-100">Felipe de Jesus Orta Escobar</p>
            <p className="h-content text-sm text-sky-300">|</p>
            <p className="h-content text-sm text-emerald-100">Mario André Lozada Alfaro</p>
        </div>
    </footer>
    );
}