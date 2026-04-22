import { useEffect, useRef, useState, type ChangeEvent } from "react";

type FormularioSubirImagenProps = {
  onArchivoSeleccionado?: (archivo: File | null) => void;
  deshabilitado?: boolean;
  urlImagenActual?: string | null;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const subirACloudinary = async (archivo: File): Promise<string> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Falta CLOUDINARY_CLOUD_NAME o CLOUDINARY_UPLOAD_PRESET en el entorno.");
  }

  const urlCloudinary = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", archivo);
  formData.append("upload_preset", UPLOAD_PRESET);

  const respuesta = await fetch(urlCloudinary, {
    method: "POST",
    body: formData,
  });

  const datos = await respuesta.json();

  if (!respuesta.ok || !datos?.secure_url) {
    throw new Error(datos?.error?.message || "No se pudo subir la imagen.");
  }

  return datos.secure_url as string;
};

export default function SelectorFotoPerfil({
  onArchivoSeleccionado,
  deshabilitado = false,
  urlImagenActual = null,
}: FormularioSubirImagenProps) {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);

  const imagenMostrada = vistaPrevia || urlImagenActual;

  useEffect(() => {
    if (!vistaPrevia) return;

    return () => {
      URL.revokeObjectURL(vistaPrevia);
    };
  }, [vistaPrevia]);

  const manejarCambioArchivo = (evento: ChangeEvent<HTMLInputElement>) => {
    if (!evento.target.files) {
      setArchivoSeleccionado(null);
      setVistaPrevia(null);
      onArchivoSeleccionado?.(null);
      return;
    }

    const archivo = evento.target.files[0];

    if (archivo) {
      if (archivo.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Máximo 2MB.");
        evento.target.value = "";
        setArchivoSeleccionado(null);
        setVistaPrevia(null);
        onArchivoSeleccionado?.(null);
        return;
      }

      const urlTemporal = URL.createObjectURL(archivo);
      if (!urlTemporal) return;

      setArchivoSeleccionado(archivo);
      setVistaPrevia(urlTemporal);
      onArchivoSeleccionado?.(archivo);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div
        className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-1 border-sky-900/60 bg-slate-800 shadow-lg transition-opacity ${deshabilitado ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"}`}
        onClick={() => !deshabilitado && inputArchivoRef.current?.click()}
      >
        {imagenMostrada ? (
          <img
            src={imagenMostrada}
            alt="Vista previa"
            className="h-full w-full object-cover"
          />
        ) : (
          null
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/35 px-2 text-center text-xs font-bold text-emerald-50">
          Click para subir foto
        </div>
      </div>

      <p className="text-xs text-slate-400">Formatos permitidos: JPG, PNG, WEBP</p>

      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={deshabilitado}
        ref={inputArchivoRef}
        onChange={manejarCambioArchivo}
      />
    </div>
  );
}