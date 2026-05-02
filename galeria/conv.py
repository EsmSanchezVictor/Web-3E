import os
from PIL import Image

def convertir_png_a_webp_transparente(carpeta_origen, carpeta_destino):
    # Crea la carpeta de destino si no existe
    if not os.path.exists(carpeta_destino):
        os.makedirs(carpeta_destino)

    # Recorre todos los archivos en la carpeta de origen
    for nombre_archivo in os.listdir(carpeta_origen):
        if nombre_archivo.lower().endswith(".jpeg"):
            ruta_entrada = os.path.join(carpeta_origen, nombre_archivo)
            
            # Crea el nuevo nombre de archivo cambiando la extensión a .webp
            nombre_sin_ext = os.path.splitext(nombre_archivo)[0]
            nombre_salida = f"{nombre_sin_ext}.webp"
            ruta_salida = os.path.join(carpeta_destino, nombre_salida)

            try:
                # Abre la imagen
                with Image.open(ruta_entrada) as img:
                    # Convertir a RGBA asegura que se mantenga la transparencia (el canal Alfa)
                    img = img.convert("RGBA")
                    
                    # Guarda la imagen. 'lossless=True' mantiene la calidad exacta, 
                    # si prefieres que pese menos, puedes quitar lossless y usar quality=90
                    img.save(ruta_salida, format="webp", lossless=True)
                    
                print(f"Éxito: {nombre_archivo} -> {nombre_salida}")
                
            except Exception as e:
                print(f"Error al procesar {nombre_archivo}: {e}")

# --- Configuración y ejecución ---

# Escribe aquí la ruta de tu carpeta con los PNG
carpeta_png = "../galeria" 

# Escribe aquí dónde quieres que se guarden los WebP
carpeta_webp = "../galeria" 

# Ejecuta la función
convertir_png_a_webp_transparente(carpeta_png, carpeta_webp)
