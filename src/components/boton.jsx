"use client";

import { Button } from "@/components/ui/button"

export default function BotonConIcono({funcion,texto,size = "default",ruta_icono,className = "",tamanioIcon = "h-10 w-10", alt_icono = "Icono del boton", variant = ""
}){
  return (
    <Button
      className={`flex justify-center items-center w-content max-w-full cursor-pointer p-4 ${className}`}
      variant={variant}
      size={size}
      onClick={funcion}
    >
      <img
        src={ruta_icono}
        alt={alt_icono}
        className={`${tamanioIcon} shrink-0 pointer-events-none`}
      />
      <span className="text-sm">{texto}</span>
    </Button>
  )
}
