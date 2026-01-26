import pandas as pd
import os

BASE_DIR = os.getcwd()
SALIDA = "alimentos_unificados.csv"

registros = []

def procesar_archivo(ruta, origen):
    try:
        df = pd.read_excel(ruta)

        # Normalizamos nombres de columnas
        df.columns = [c.lower().strip() for c in df.columns]

        # Buscamos columnas clave
        col_alimento = next((c for c in df.columns if "food" in c or "alimento" in c), None)
        col_kcal = next((c for c in df.columns if "kcal" in c or "energy" in c), None)

        if not col_alimento or not col_kcal:
            return

        for _, fila in df.iterrows():
            registros.append({
                "origen": origen,
                "archivo": os.path.basename(ruta),
                "alimento": str(fila[col_alimento]).strip(),
                "kcal_100g": fila[col_kcal]
            })

    except Exception as e:
        print(f"Error en {ruta}: {e}")

# --- FAO ---
fao_path = os.path.join(BASE_DIR, "fao")
for f in os.listdir(fao_path):
    if f.endswith((".xls", ".xlsx")):
        procesar_archivo(os.path.join(fao_path, f), "FAO")

# --- ARGENFOOD ---
argen_path = os.path.join(BASE_DIR, "argenfood")
for f in os.listdir(argen_path):
    if f.endswith((".xls", ".xlsx")):
        procesar_archivo(os.path.join(argen_path, f), "ARGENFOOD")

# Guardamos CSV
df_final = pd.DataFrame(registros)
df_final.dropna(subset=["alimento", "kcal_100g"], inplace=True)
df_final.to_csv(SALIDA, index=False, encoding="utf-8-sig")

print(f"\n✔ Archivo generado: {SALIDA}")
print(f"✔ Registros totales: {len(df_final)}")
