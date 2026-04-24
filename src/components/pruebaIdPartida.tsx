"use client";

import React, { useEffect, useState } from 'react';
// Importamos la nueva función
import { obtenerIdUsuario, obtenerIdPartida, obtenerPartidaUsuario, obtenerNombrePorId } from '@/services/api';

export default function PruebaIdPartida({ nombreUsuario }: { nombreUsuario: string }) {
  const [idPartida, setIdPartida] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>("Buscando partida...");
  
  // Estados para guardar los nombres reales
  const [nombreBlancas, setNombreBlancas] = useState<string>("Cargando...");
  const [nombreNegras, setNombreNegras] = useState<string>("Cargando...");

  useEffect(() => {
    const hacerPrueba = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMensaje("Error: No se encontró el token de seguridad.");
          return;
        }

        const idUsuario = await obtenerIdUsuario(nombreUsuario);
        if (!idUsuario) {
          setMensaje(`Error: No se encontró el ID para el usuario ${nombreUsuario}`);
          return;
        }

        const id = await obtenerIdPartida(token, idUsuario);
        
        if (id) {
          setIdPartida(id);
          setMensaje("¡Éxito! Partida encontrada, traduciendo IDs a nombres...");

          const partida = await obtenerPartidaUsuario(token, id);
          
          if (partida) {
             // 1. Extraemos los IDs que nos mandó la base de datos
             const idBlancas = partida.id_usuario_blancas;
             const idNegras = partida.id_usuario_negras;

             // 2. Pedimos los nombres reales usando nuestra nueva función
             // Usamos Promise.all para hacer ambas peticiones al mismo tiempo y que sea súper rápido
             const [nombreB, nombreN] = await Promise.all([
               obtenerNombrePorId(idBlancas),
               obtenerNombrePorId(idNegras)
             ]);

             // 3. Guardamos los nombres en el estado para que se muestren en pantalla
             setNombreBlancas(nombreB);
             setNombreNegras(nombreN);
             setMensaje("¡Éxito total! Datos procesados correctamente.");

          } else {
             setMensaje("Se encontró el ID, pero los detalles llegaron vacíos.");
          }

        } else {
          setMensaje("Conexión exitosa, pero el usuario no tiene partidas registradas.");
        }

      } catch (error) {
        console.error(error);
        setMensaje("Falló la conexión con el backend (revisa la consola).");
      }
    };

    if (nombreUsuario) {
      hacerPrueba();
    }
  }, [nombreUsuario]);

  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mt-6 w-full max-w-md">
      <h3 className="font-bold text-blue-800 mb-2">Modo de Depuración (Prueba API)</h3>
      <p className="text-gray-700"><strong>Estado:</strong> {mensaje}</p>
      
      {idPartida && (
        <div className="mt-4">
          <p className="text-lg mb-2">
            ID de la partida: <span className="font-mono font-bold bg-white px-2 py-1 rounded text-red-600">{idPartida}</span>
          </p>
          
          <div className="text-sm text-gray-700 p-3 bg-white rounded border border-gray-200 shadow-sm">
            <h4 className="font-bold border-b pb-2 mb-2">Enfrentamiento:</h4>
            <p className="mb-1">
              <span className="inline-block w-20 font-semibold text-gray-500">Blancas:</span> 
              <span className="font-bold text-blue-600 text-base">{nombreBlancas}</span>
            </p>
            <p>
              <span className="inline-block w-20 font-semibold text-gray-500">Negras:</span> 
              <span className="font-bold text-gray-800 text-base">{nombreNegras}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}