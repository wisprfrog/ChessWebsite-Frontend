const url_api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

export { validarToken };