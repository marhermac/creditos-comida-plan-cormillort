import os
import re

# carpeta actual
carpeta = os.getcwd()
nombre_carpeta = os.path.basename(carpeta).lower()

# prefijo según carpeta
if "fao" in nombre_carpeta:
    prefijo = "fao_"
elif "argen" in nombre_carpeta:
    prefijo = "argen_"
else:
    prefijo = ""

for archivo in os.listdir(carpeta):
    if archivo.lower().endswith((".xls", ".xlsx")):

        nombre, ext = os.path.splitext(archivo)
        nuevo = nombre.lower()

        # eliminar versiones tipo 1.0 , 4.0 , (2)
        nuevo = re.sub(r"\(\d+\)", "", nuevo)
        nuevo = re.sub(r"\d+\.\d+", "", nuevo)

        # reemplazos comunes
        nuevo = nuevo.replace(" ", "_")
        nuevo = nuevo.replace("__", "_")

        # prefijo si no existe
        if not nuevo.startswith(prefijo):
            nuevo = prefijo + nuevo

        nuevo_nombre = nuevo + ext.lower()

        if archivo != nuevo_nombre:
            print(f"{archivo}  -->  {nuevo_nombre}")
            os.rename(archivo, nuevo_nombre)

print("\n✔ Renombrado finalizado")
