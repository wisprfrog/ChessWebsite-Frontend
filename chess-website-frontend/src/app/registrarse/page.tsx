import FormularioRegistro from '../../components/formularioRegistro'; 

export default function PaginaRegistro() {
    return (
        <main style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
            <div>
                <h1>Crea una cuenta nueva</h1>
                <p>Ingresa tus datos a continuación:</p>
                
                <FormularioRegistro />
                <p>
                    ¿Ya tienes una cuenta? <a href="../inicio_sesion">Inicia sesión aquí</a>
                </p>
            </div>
        </main>
    );
}