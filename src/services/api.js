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
  const respuesta = await fetch(`${url_api}/api/usuario/id_usuario/contrasenia`, {
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

const obtenerListaAmigos = async (id_usuario) => {
  const respuesta = await fetch(`${url_api}/api/amigo/id_usuario/amigo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ 'id_usuario': id_usuario })
  });

  const res = await respuesta.json();
  const listaAmigos = res.amigos.map(amigo => amigo.id_amigo);

  return listaAmigos;
}

const obtenerIdUsuario = async (nombre_usuario) => {
  const respuesta = await fetch(`${url_api}/api/usuario/id_usuario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({'nombre_usuario': nombre_usuario})
  });

  const res = await respuesta.json();
  const idUsuario = res?.nombres?.[0]?.id_usuario;

  return idUsuario;
}

const obtenerEstadisticasUsuario = async (id_usuario) => {
  const respuesta = await fetch(`${url_api}/api/estadistica/id_usuario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ 'id_usuario': id_usuario })
  });

  const res = await respuesta.json();
  const estadistica = res?.estadistica?.[0];

  return estadistica;
}


export { validarToken, generarToken, cambiarNombreUsuario, cambiarContrasena, obtenerListaAmigos, obtenerIdUsuario, obtenerEstadisticasUsuario };