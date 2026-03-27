'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioInicioSesion() {
    const router = useRouter();
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const [iniciarSesion, setIniciarSesion] = useState(false);

    const enviarInicioSesion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página se recargue
        setCargando(true);
        setMensaje(''); // Limpia mensajes de errores anteriores

        try {
            let nombre_usuario = "", correo = "";
            if(/^[a-zA-Z0-9._%+-]+@[a-z]+\.[a-zA-Z]{2,}$/.test(usuario)) correo = usuario;
            else nombre_usuario = usuario;

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const respuesta = await fetch(`${apiUrl}/api/usuario/login/token`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000'
                },
                body: JSON.stringify({ nombre_usuario, correo, contrasenia })
            });

            // Comprobamos si la petición fue exitosa (status 200-299)
            if (respuesta.ok) {
                const res = await respuesta.json();

                //token guardado en navegador para futuras peticiones
                localStorage.setItem('token', res.token);

                router.push('/');
                setIniciarSesion(true);
            } else {
                // Si el backend manda un error (ej. el correo ya existe)
                setMensaje('Hubo un error al registrar');
            }

        } catch (error) {
            console.error("Error en la petición:", error);
            setMensaje('Error en el servidor. Por favor, intenta nuevamente más tarde.');
        }
        finally {
            setCargando(false);
        }
    };

    if(!iniciarSesion){
        return (
            // Usamos un <form> para poder aprovechar el "e.preventDefault()"
            <form onSubmit={enviarInicioSesion} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
                
                <input 
                    type="text" 
                    placeholder="Nombre de usuario o correo" 
                    value={usuario} 
                    onChange={(e) => setUsuario(e.target.value)} 
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
                    {cargando ? 'Cargando...' : 'Iniciar sesión'}
                </button>

                {/* Mostramos el mensaje de éxito o error si existe */}
                {mensaje && <p>{mensaje}</p>}
            </form>
        );
    }

    return null;
}