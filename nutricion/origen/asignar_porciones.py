import pandas as pd

# --- 1. Leer CSVs ---
argen_csv = "argenfood_normalizado.csv"
medidas_csv = "medidas_caseras_estandar.csv"

# Leer el CSV principal
df_alimentos = pd.read_csv(argen_csv)

# Leer medidas estándar (aunque no las usamos directamente, sirve para referencia)
df_medidas = pd.read_csv(medidas_csv, sep=";")

# --- 2. Crear mapeo archivo → categoría, medida y gramos ---
archivo_categoria = {
    "argen_verduras.xls": ("verdura", "taza_verduras_crudas", 65),
    "argen_frutas.xls": ("fruta", "taza_verduras_crudas", 65),
    "argen_carnes.xls": ("carne", "porcion_carne_chica", 100),
    "argen_pescados.xls": ("pescado", "porcion_carne_chica", 100),
    "argen_pasta.xls": ("pasta", "taza_arroz_cocido", 165),
    "argen_arroz.xls": ("arroz", "taza_arroz_cocido", 165),
    "argen_panificados.xls": ("pan", "rodaja_pan_lactal", 25),
    "argen_quesos.xls": ("queso", "feta_queso", 22),
    "argen_huevos.xls": ("huevo", "huevo_unidad", 50),
    "argen_aceites.xls": ("aceite", "cda_aceite", 10),
    "argen_azucar.xls": ("azúcar", "cda_azucar", 10)
}

# --- 3. Asignar categoría, medida y gramos ---
def asignar_categoria(row):
    archivo = row["archivo"]
    if archivo in archivo_categoria:
        cat, medida, gramos = archivo_categoria[archivo]
        return pd.Series([cat, medida, gramos])
    else:
        return pd.Series(["otros", "otros", 0])

df_alimentos[["categoria", "medida_casera", "gramos_aprox"]] = df_alimentos.apply(asignar_categoria, axis=1)

# --- 4. Convertir columnas a numérico ---
# Reemplaza comas por puntos si existen
df_alimentos["kcal_100g"] = pd.to_numeric(df_alimentos["kcal_100g"].astype(str).str.replace(',', '.'), errors='coerce')
df_alimentos["gramos_aprox"] = pd.to_numeric(df_alimentos["gramos_aprox"], errors='coerce')

# --- 5. Calcular kcal por porción ---
df_alimentos["kcal_por_porcion"] = (df_alimentos["kcal_100g"] * df_alimentos["gramos_aprox"] / 100).round(1)

# --- 6. Guardar CSV final ---
df_alimentos_final = df_alimentos[[
    "alimento_normalizado",
    "kcal_100g",
    "archivo",
    "categoria",
    "medida_casera",
    "gramos_aprox",
    "kcal_por_porcion"
]]

df_alimentos_final.to_csv("argenfood_con_porciones.csv", index=False)

print("✅ CSV generado: argenfood_con_porciones.csv")
