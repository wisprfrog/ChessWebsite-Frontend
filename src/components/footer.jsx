'use client'
export default function Footer() {

    return (
    <footer className='w-full h-content m-0 p-5 flex flex-col items-center justify-start bg-green-900 text-white gap-y-5'>
        <div className='w-full h-content flex justify-center items-between gap-x-30'>
            <p className="text-sm h-content">Universidad Autonoma del Estado de Hidalgo</p>
            <p className="text-sm h-content">Licenciatura en Ciencias Computacionales</p>
            <p className="text-sm h-content">Bases de datos distribuidas</p>
            <p className="text-sm h-content">6° 1</p>
        </div>
        <div className='w-full h-content flex justify-center items-between gap-x-5'>
            <p className="text-sm h-content">Mauricio Daniel Manzanilla Hornung</p>
            <p className="text-sm h-content">|</p>
            <p className="text-sm h-content">Brandom Galder Hernandez Franco</p>
            <p className="text-sm h-content">|</p>
            <p className="text-sm h-content">Felipe de Jesus Orta Escobar</p>
            <p className="text-sm h-content">|</p>
            <p className="text-sm h-content">Mario André Lozada Alfaro</p>
        </div>
    </footer>
    );
}