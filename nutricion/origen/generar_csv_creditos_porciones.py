import pandas as pd

# --- 1. Leer CSVs ---
argen_csv = "argenfood_normalizado.csv"
medidas_csv = "medidas_caseras_estandar.csv"

df_alimentos = pd.read_csv(argen_csv)
df_medidas = pd.read_csv(medidas_csv, sep=";")

# --- 2. Mapeo archivo → categoría y medida ---
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

def asignar_categoria(row):
    archivo = row["archivo"]
    if archivo in archivo_categoria:
        cat, medida, gramos = archivo_categoria[archivo]
        return pd.Series([cat, medida, gramos])
    else:
        return pd.Series(["otros", "otros", 0])

df_alimentos[["categoria", "medida_casera", "gramos_aprox"]] = df_alimentos.apply(asignar_categoria, axis=1)

# --- 3. Convertir columnas a números ---
df_alimentos["kcal_100g"] = pd.to_numeric(df_alimentos["kcal_100g"].astype(str).str.replace(',', '.'), errors='coerce')
df_alimentos["gramos_aprox"] = pd.to_numeric(df_alimentos["gramos_aprox"], errors='coerce')

# --- 4. Calcular kcal por porción ---
df_alimentos["kcal_por_porcion"] = (df_alimentos["kcal_100g"] * df_alimentos["gramos_aprox"] / 100).round(1)

# --- 5. Asignar créditos por 100 g y color ---
def creditos_color(kcal):
    if kcal <= 25:
        return 0.5, "verde"
    elif kcal <= 50:
        return 1, "verde"
    elif kcal <= 100:
        return 2, "amarillo"
    elif kcal <= 200:
        return 3, "amarillo"
    else:
        return 4, "rojo"

df_alimentos[["creditos_100g", "color_creditos"]] = df_alimentos["kcal_100g"].apply(lambda x: pd.Series(creditos_color(x)))

# --- 6. Calcular créditos por porción ---
df_alimentos["creditos_por_porcion"] = (df_alimentos["creditos_100g"] * df_alimentos["gramos_aprox"] / 100).round(2)

# --- 7. Preparar CSV final ---
df_final = df_alimentos[[
    "alimento_normalizado",
    "medida_casera",
    "creditos_por_porcion",
    "creditos_100g",
    "color_creditos"
]]

# Renombrar columnas según estructura web
df_final.columns = ["Alimento", "PORCION", "creditospor_porcion", "creditoscada100_grs", "Color_de_los_creditos"]

df_final.to_csv("argenfood_con_creditos_porciones.csv", index=False)

print("✅ CSV final generado: argenfood_con_creditos_porciones.csv")
