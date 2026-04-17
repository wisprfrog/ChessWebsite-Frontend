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
  if (!id_usuario) {
    return [];
  }

  const respuesta = await fetch(`${url_api}/api/amigo/id_usuario/amigo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ 'id_usuario': id_usuario ,  })
  });

  if (!respuesta.ok) {
    return [];
  }

  const res = await respuesta.json();
  const amigos = Array.isArray(res?.amigos) ? res.amigos : [];

  const listaAmigos = amigos
    .map((amigo) => ({ id: amigo?.id_amigo, nombre_usuario: amigo?.nombre_amigo }))
    .filter(Boolean);

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

const obtenerNombrePorId = async (id_usuario) => {
  const respuesta = await fetch(`${url_api}/api/usuario/id_usuario/nombre_usuario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({'id_usuario': id_usuario})
  });

  const res = await respuesta.json();
  const nombreUsuario = res?.nombres?.[0]?.nombre_usuario;

  return nombreUsuario;
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

const eliminarAmigo = async (token, id_usuario, id_amigo) => {
  const respuesta = await fetch(`${url_api}/api/amigo/id_usuario/id_amigo`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': origin
    },
    body: JSON.stringify({ 'id_usuario': id_usuario, 'id_amigo': id_amigo })
  });

  return respuesta;
}

const obtenerMovimientosPartida = async (id_partida) => {
  const respuesta = await fetch(`${url_api}/api/partida/id_partida/repeticion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ 'id_partida': id_partida })
  });

  if (!respuesta.ok) {
    throw new Error(`Error al obtener movimientos de la partida:`);
  }

  const res = await respuesta.json();
  const movimientos = res?.movimientos;

  if (Array.isArray(movimientos)) {
    return movimientos
      .map((movimiento) => (typeof movimiento === 'string' ? movimiento.trim() : ''))
      .filter(Boolean);
  }

  if (typeof movimientos === 'string') {
    return movimientos
      .split(',')
      .map((movimiento) => movimiento.trim())
      .filter(Boolean);
  }

  return [];
}

const agregarAmigo = async (token, id_usuario, id_amigo) => {
  const respuesta = await fetch(`${url_api}/api/amigo/id_usuario/id_amigo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': origin
    },
    body: JSON.stringify({ 'id_usuario': id_usuario, 'id_amigo': id_amigo })
  });

  return respuesta;
}

const obtenerIdPartida = async (token, id_usuario) => {
  const respuesta = await fetch(`${url_api}/api/partida/id_usuario/partidas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
      'Origin': origin
    },
    body: JSON.stringify({ 'id_usuario': id_usuario })
  });

  if (!respuesta.ok) {
    const detalleError = await respuesta.text();
    console.error(`Express Error (obtenerIdPartida) - Status ${respuesta.status}: ${detalleError}`);
    throw new Error("Error en obtenerIdPartida");
  }

  const res = await respuesta.json();
  
  const idPartida = res?.partidas?.[0]?.id_partida;

  return idPartida;
}

const obtenerPartidaUsuario = async (token, id_partida) => {
  const respuesta = await fetch(`${url_api}/api/partida/id_partida`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
      'Origin': origin
    },
    body: JSON.stringify({ 'id_partida': id_partida })
  });

  if (!respuesta.ok) {
    const detalleError = await respuesta.text();
    console.error(`Express Error (obtenerPartidaUsuario) - Status ${respuesta.status}: ${detalleError}`);
    throw new Error("Error en obtenerPartidaUsuario");
  }

  const res = await respuesta.json();
  const partida = res?.partida?.[0];

  return partida;
}

const obtenerListaPartidas = async (token, id_usuario) => {
  const respuesta = await fetch(`${url_api}/api/partida/id_usuario/partidas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': origin
    },
    body: JSON.stringify({ 'id_usuario': id_usuario })
  });

  if (!respuesta.ok) {
    console.error("Error al obtener la lista de partidas");
    return [];
  }

  const res = await respuesta.json();

  return res?.partidas || []; 
}

const obtenerHistorialCompleto = async (nombre_usuario) => {
  try {
    const respuesta = await fetch(`${url_api}/api/partida/nombre_usuario/historial`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': origin
      },
      // Pasamos directamente el nombre de usuario, sin token
      body: JSON.stringify({ 'nombre_usuario': nombre_usuario })
    });

    if (!respuesta.ok) return [];

    const res = await respuesta.json();
    return res.partidas || [];
  } catch (error) {
    console.error("Error de red al obtener el historial:", error);
    return [];
  }
}

const obtenerUsuariosEnPartida = async (id_partida) => {
  const respuesta = await fetch(`${url_api}/api/partida/id_partida`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ 'id_partida': id_partida })
  });

  if (!respuesta.ok) {
    console.error("Error al obtener los usuarios en la partida");
    return [];
  }

  const res = await respuesta.json();
  return [res.partida[0].id_usuario_blancas, res.partida[0].id_usuario_negras] || [];
}


export { validarToken, generarToken, cambiarNombreUsuario, cambiarContrasena, obtenerListaAmigos, obtenerIdUsuario, obtenerEstadisticasUsuario, eliminarAmigo, obtenerMovimientosPartida, agregarAmigo, obtenerIdPartida, obtenerPartidaUsuario, obtenerNombrePorId, obtenerListaPartidas, obtenerHistorialCompleto, obtenerUsuariosEnPartida };