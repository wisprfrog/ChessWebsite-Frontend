const url_api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const origin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';

const validarToken = async (token) => {

  const respuesta = await fetch(`${url_api}/api/usuario/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (respuesta.status === 200) return true;

  console.log("Token no válido o ha expirado");
  return false;
}

const generarToken = async (nombre_usuario, correo, contrasenia) => {
  const respuesta = await fetch(`${url_api}/api/usuario/login/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ nombre_usuario, correo, contrasenia })
  });

  return respuesta;
}

const cambiarNombreUsuario = async (token, nombre_usuario, nuevo_nombre) => {
  const respuesta = await fetch(`${url_api}/api/usuario/id_usuario/nombre_usuario`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': origin
    },
    body: JSON.stringify({ nombre_usuario, nuevo_nombre_usuario: nuevo_nombre })
  });

  return respuesta;
}

const cambiarContrasena = async (token, contrasena_anterior, contrasena_nueva) => {
  const respuesta = await fetch(`${url_api}/api/usuario/id_usuario/contrasena`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': origin
    },
    body: JSON.stringify({contrasenia: contrasena_anterior, nueva_contrasenia: contrasena_nueva})
  });

  return respuesta;
}

export { validarToken, generarToken, cambiarNombreUsuario, cambiarContrasena };