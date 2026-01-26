import pandas as pd
import unicodedata
import re

ENTRADA = "argenfood_unificado.csv"
SALIDA = "argenfood_normalizado.csv"

# Palabras a eliminar
PALABRAS_RUIDO = [
    "crudo", "cocido", "fresco", "pasteurizado", "congelado",
    "deshidratado", "sin cáscara", "con cáscara",
    "parte comestible", "promedio"
]

def quitar_acentos(texto):
    return ''.join(
        c for c in unicodedata.normalize('NFD', texto)
        if unicodedata.category(c) != 'Mn'
    )

def normalizar_nombre(nombre):
    nombre = str(nombre).lower()

    for palabra in PALABRAS_RUIDO:
        nombre = nombre.replace(palabra, "")

    nombre = nombre.replace(",", " ")
    nombre = re.sub(r"\s+", " ", nombre).strip()
    nombre = quitar_acentos(nombre)

    return nombre.title()

# Leer CSV
df = pd.read_csv(ENTRADA)

# 🔎 Detectar columna kcal automáticamente
col_kcal = None
for col in df.columns:
    if "kcal" in col.lower():
        col_kcal = col
        break

if not col_kcal:
    raise ValueError("❌ No se encontró columna de kcal")

# Normalizar nombres
df["alimento_normalizado"] = df["alimento"].apply(normalizar_nombre)

# Limpiar
df = df.dropna(subset=["alimento_normalizado", col_kcal])

# Renombrar para estándar
df = df.rename(columns={col_kcal: "kcal_100g"})

# Guardar
df.to_csv(SALIDA, index=False, encoding="utf-8-sig")

print("✅ Normalización completa")
print(f"📄 Archivo generado: {SALIDA}")
print(f"📊 Registros: {len(df)}")
print(f"🔥 Columna kcal detectada: {col_kcal}")
