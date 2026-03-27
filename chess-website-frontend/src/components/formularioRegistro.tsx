'use client'

import { useState } from 'react';

export default function FormularioRegistro() {
    const [nombre_usuario, setUsername] = useState('');
    const [contrasenia, setPassword] = useState('');
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const enviarRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página se recargue
        setCargando(true);
        setMensaje(''); // Limpia mensajes de errores anteriores

        try {
            // Nota: Verifica si tu endpoint necesita una ruta final, ej: /api/registro
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const respuesta = await fetch(`${apiUrl}/api/usuario/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_usuario, correo, contrasenia })
            });

            const res = await respuesta.json();

            // Comprobamos si la petición fue exitosa (status 200-299)
            if (respuesta.ok) {
                setMensaje('¡Usuario registrado con éxito!');
                // Opcional: Limpiar el formulario
                setUsername('');
                setCorreo('');
                setPassword('');
            } else {
                // Si el backend manda un error (ej. el correo ya existe)
                setMensaje(res.mensaje || 'Hubo un error al registrar');
            }

        } catch (error) {
            console.error("Error en la petición:", error);
            setMensaje('Error al conectar con el servidor.');
        } finally {
            setCargando(false); // Apagamos el estado de carga sin importar qué pase
        }
    };

    return (
        // Usamos un <form> para poder aprovechar el "e.preventDefault()"
        <form onSubmit={enviarRegistro} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
            
            <input 
                type="text" 
                placeholder="Nombre de usuario" 
                value={nombre_usuario} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
            />
            
            <input 
                type="email" 
                placeholder="Correo electrónico" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                required 
            />
            
            <input 
                type="password" 
                placeholder="Contraseña" 
                value={contrasenia} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />

            <button type="submit" disabled={cargando}>
                {cargando ? 'Registrando...' : 'Registrar Usuario'}
            </button>

            {/* Mostramos el mensaje de éxito o error si existe */}
            {mensaje && <p>{mensaje}</p>}
            
        </form>
    );
}