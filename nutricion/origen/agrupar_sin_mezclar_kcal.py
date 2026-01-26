import pandas as pd

ENTRADA = "argenfood_normalizado.csv"
SALIDA = "argenfood_agrupado.csv"

# Leer datos
df = pd.read_csv(ENTRADA)

# Asegurar tipos
df["alimento_normalizado"] = df["alimento_normalizado"].astype(str).str.strip()
df["kcal_100g"] = pd.to_numeric(df["kcal_100g"], errors="coerce")

# Eliminar filas inválidas
df = df.dropna(subset=["alimento_normalizado", "kcal_100g"])

# Agrupar SOLO si nombre + kcal son iguales
df_final = (
    df
    .groupby(["alimento_normalizado", "kcal_100g"], as_index=False)
    .first()
)

# Guardar
df_final.to_csv(SALIDA, index=False, encoding="utf-8-sig")

print("✅ Agrupación completa")
print(f"📄 Archivo generado: {SALIDA}")
print(f"📊 Registros finales: {len(df_final)}")
