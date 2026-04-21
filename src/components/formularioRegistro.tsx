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
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md flex flex-col items-center space-y-8">
            <h1 className="mt-4 text-center text-4xl font-bold uppercase tracking-wide text-amber-100">
            Monster Chess of Clans
            </h1>
        <section className="mt-3 w-full max-w-sm rounded-xl border border-sky-900/60 bg-slate-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-amber-50">Crea una cuenta nueva</h2>
                <p className="mt-2 text-sm text-emerald-200/80">
                    Ingresa tus datos para registrarte y comenzar a jugar.
                </p>
            </div>

            <form onSubmit={enviarRegistro} className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <label htmlFor="nombre_usuario" className="text-sm font-medium text-amber-100">
                        Nombre de usuario
                    </label>
                    <input
                        id="nombre_usuario"
                        type="text"
                        placeholder="tu_usuario"
                        value={nombre_usuario}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-10 rounded-md border border-slate-600 bg-slate-800 px-3 text-sm text-amber-50 outline-none transition placeholder:text-slate-300/60 focus:border-amber-400"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="correo" className="text-sm font-medium text-amber-100">
                        Correo electronico
                    </label>
                    <input
                        id="correo"
                        type="email"
                        placeholder="m@example.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="h-10 rounded-md border border-slate-600 bg-slate-800 px-3 text-sm text-amber-50 outline-none transition placeholder:text-slate-300/60 focus:border-amber-400"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="contrasenia" className="text-sm font-medium text-amber-100">
                        Contraseña
                    </label>
                    <input
                        id="contrasenia"
                        type="password"
                        value={contrasenia}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 rounded-md border border-slate-600 bg-slate-800 px-3 text-sm text-amber-50 outline-none transition placeholder:text-slate-300/60 focus:border-amber-400"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="confirmar_contrasenia" className="text-sm font-medium text-amber-100">
                        Confirmar contraseña
                    </label>
                    <input
                        id="confirmar_contrasenia"
                        type="password"
                        value={confirmar_contrasenia}
                        onChange={(e) => setConfirmarContrasenia(e.target.value)}
                        className="h-10 rounded-md border border-slate-600 bg-slate-800 px-3 text-sm text-amber-50 outline-none transition placeholder:text-slate-300/60 focus:border-amber-400"
                        required
                    />
                </div>



                {mensaje ? (
                    <p className={`text-sm ${mensaje.includes('éxito') ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {mensaje}
                    </p>
                ) : null}

                <button
                    type="submit"
                    className="h-10 w-full rounded-md bg-amber-500 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={cargando}
                >
                    {cargando ? 'Registrando...' : 'Registrar Usuario'}
                </button>

                <a href="../inicio_sesion" className="underline text-center text-sm text-amber-100 underline-offset-4 hover:text-yellow-300">
                    Ya tengo cuenta
                </a>
            </form>
        </section>
        </div>
        </main>
    );
}