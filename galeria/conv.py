import os
from PIL import Image

def optimizar_webp(directorio_entrada, porcentaje_reduccion=0.70):
    # Extensiones a procesar
    extension = ".webp"
    
    # Verificar si el directorio existe
    if not os.path.exists(directorio_entrada):
        print(f"La carpeta {directorio_entrada} no existe.")
        return

    # Recorrer archivos en la carpeta
    for archivo in os.listdir(directorio_entrada):
        if archivo.lower().endswith(extension):
            ruta_completa = os.path.join(directorio_entrada, archivo)
            
            try:
                with Image.open(ruta_completa) as img:
                    # Calcular nuevas dimensiones (manteniendo relación de aspecto)
                    ancho_original, alto_original = img.size
                    nuevo_ancho = int(ancho_original * porcentaje_reduccion)
                    nuevo_alto = int(alto_original * porcentaje_reduccion)
                    
                    # Redimensionar
                    img_redimensionada = img.resize((nuevo_ ancho, nuevo_alto), Image.LANCZOS)
                    
                    # Sobrescribir el archivo original con la versión reducida
                    img_redimensionada.save(ruta_completa, "webp", quality=80)
                    print(f"Optimizado: {archivo} ({nuevo_ancho}x{nuevo_alto})")
                    
            except Exception as e:
                print(f"Error procesando {archivo}: {e}")

# Uso del script
# Cambia 'assets' por la ruta de tu carpeta de imágenes
ruta_assets = "../galeria" 
optimizar_webp(ruta_assets)
