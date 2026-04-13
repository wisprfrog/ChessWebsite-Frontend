'use client'
export default function Footer() {

    return (
    <footer className='w-full h-50 m-0 p-4 flex items-center justify-start bg-green-900 text-white '>
        <div className='w-2/5 h-full flex flex-col items-start justify-between p-4'>
            <p>Universidad Autonoma del Estado de Hidalgo</p>
            <p>Licenciatura en Ciencias Computacionales</p>
            <p>Bases de datos distribuidas</p>
            <p>6° 1</p>
        </div>
        <div className='w-2/5 h-full flex flex-col items-start justify-between p-4'>
            <p>Mauricio Daniel Manzanilla Hornung</p>
            <p>Brandom Galder Hernandez Franco</p>
            <p>Felipe de Jesus Orta Escobar</p>
            <p>Mario André Lozada Alfaro</p>
        </div>
    </footer>
    );
}