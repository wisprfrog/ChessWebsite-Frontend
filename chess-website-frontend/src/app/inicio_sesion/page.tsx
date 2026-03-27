import FormularioInicioSesion from '../../components/formularioInicioSesion'; 

export default function PaginaInicioSesion() {
    return (
        <main style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
            <div>
                <h1>Inicia Sesion</h1>
                <p>Ingresa tus datos a continuación:</p>
                
                <FormularioInicioSesion />
                
            </div>
        </main>
    );
}