import pandas as pd
import os
import re

BASE_DIR = os.getcwd()
CARPETA_DATOS = "argenfood"
ARCHIVO_MAPEO = "mapeo_columnas argenfood.xlsx"
SALIDA = "argenfood_unificado.csv"

# === CONFIGURACIÓN FIJA ===
COL_ALIMENTO = 2   # col 2
COL_KCAL = 6       # col 6

registros = []

# Leer mapeo
df_mapeo = pd.read_excel(ARCHIVO_MAPEO)
df_mapeo.columns = [c.lower().strip() for c in df_mapeo.columns]

# Detectar columna archivo
col_archivo = df_mapeo.columns[0]

archivos = df_mapeo[col_archivo].dropna().unique()

for archivo in archivos:
    ruta = os.path.join(BASE_DIR, CARPETA_DATOS, archivo)

    if not os.path.exists(ruta):
        print(f"⚠️ No existe: {archivo}")
        continue

    try:
        df = pd.read_excel(ruta, header=None)

        for _, fila in df.iterrows():
            try:
                alimento = fila[COL_ALIMENTO - 1]
                kcal = fila[COL_KCAL - 1]

                if pd.isna(alimento) or pd.isna(kcal):
                    continue

                registros.append({
                    "origen": "ARGENFOOD",
                    "archivo": archivo,
                    "alimento": str(alimento).strip(),
                    "kcal_100g": kcal
                })

            except IndexError:
                continue

        print(f"✔ Procesado: {archivo}")

    except Exception as e:
        print(f"❌ Error en {archivo}: {e}")

# Crear CSV final
df_final = pd.DataFrame(registros)

if df_final.empty:
    print("\n❌ No se generaron registros")
else:
    df_final.to_csv(SALIDA, index=False, encoding="utf-8-sig")
    print(f"\n✔ CSV generado: {SALIDA}")
    print(f"✔ Total registros: {len(df_final)}")
