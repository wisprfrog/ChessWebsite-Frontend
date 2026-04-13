'use client'

import { useState } from 'react';

export default function FormularioRegistro() {
    const [nombre_usuario, setUsername] = useState('');
    const [contrasenia, setPassword] = useState('');
    const [confirmar_contrasenia, setConfirmarContrasenia] = useState('');
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);


    const enviarRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página se recargue
        if (confirmar_contrasenia !== contrasenia) {
            setMensaje('Las contraseñas no coinciden');
            return;
        }

        setCargando(true);
        setMensaje(''); // Limpia mensajes de errores anteriores

        try {
            // Nota: Verifica si tu endpoint necesita una ruta final, ej: /api/registro
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const respuesta = await fetch(`${apiUrl}/api/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000'
                 },
                body: JSON.stringify({
                    nombre_usuario,
                    correo,
                    contrasenia
                })
            });

            

            // Comprobamos si la petición fue exitosa (status 200-299)
            if (!respuesta.ok) {
                // Si el backend manda un error (ej. el correo ya existe)
                setMensaje('Hubo un error al registrar');
            } else {
                setMensaje('¡Usuario registrado con éxito!');
                // Opcional: Limpiar el formulario
                setUsername('');
                setCorreo('');
                setPassword('');
                setConfirmarContrasenia('');
            }

        } catch (error) {
            console.error("Error en la petición:", error);
            setMensaje('Error al conectar con el servidor.');
        } finally {
            setCargando(false); // Apagamos el estado de carga sin importar qué pase
        }
    };

    return (
        <section className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Crea una cuenta nueva</h2>
                <p className="mt-2 text-sm text-zinc-600">
                    Ingresa tus datos para registrarte y comenzar a jugar.
                </p>
            </div>

            <form onSubmit={enviarRegistro} className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <label htmlFor="nombre_usuario" className="text-sm font-medium text-zinc-800">
                        Nombre de usuario
                    </label>
                    <input
                        id="nombre_usuario"
                        type="text"
                        placeholder="tu_usuario"
                        value={nombre_usuario}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-500"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="correo" className="text-sm font-medium text-zinc-800">
                        Correo electronico
                    </label>
                    <input
                        id="correo"
                        type="email"
                        placeholder="m@example.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-500"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="contrasenia" className="text-sm font-medium text-zinc-800">
                        Contraseña
                    </label>
                    <input
                        id="contrasenia"
                        type="password"
                        value={contrasenia}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-500"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="confirmar_contrasenia" className="text-sm font-medium text-zinc-800">
                        Confirmar contraseña
                    </label>
                    <input
                        id="confirmar_contrasenia"
                        type="password"
                        value={confirmar_contrasenia}
                        onChange={(e) => setConfirmarContrasenia(e.target.value)}
                        className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-500"
                        required
                    />
                </div>



                {mensaje ? (
                    <p className={`text-sm ${mensaje.includes('éxito') ? 'text-green-600' : 'text-red-600'}`}>
                        {mensaje}
                    </p>
                ) : null}

                <button
                    type="submit"
                    className="h-10 w-full rounded-md bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={cargando}
                >
                    {cargando ? 'Registrando...' : 'Registrar Usuario'}
                </button>

                <a href="../inicio_sesion" className="text-center text-sm underline-offset-4 hover:underline">
                    Ya tengo cuenta
                </a>
            </form>
        </section>
    );
}