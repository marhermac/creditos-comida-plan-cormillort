import pandas as pd
from pathlib import Path

ARCHIVO_MAPEO = "mapeo_columnas fao.xlsx"
SALIDA = "fao_unificado.csv"

# Leer mapeo
df_mapeo = pd.read_excel(ARCHIVO_MAPEO)

registros = []

for _, row in df_mapeo.iterrows():
    archivo = row["archivo"]
    hoja = row["page"]   # 👈 ESTE ERA EL PROBLEMA

    if not Path(archivo).exists():
        print(f"⚠️ No existe: {archivo}")
        continue

    try:
        df = pd.read_excel(
            archivo,
            sheet_name=hoja
        )

        if "Food name in English" not in df.columns:
            print(f"⚠️ Falta Foodname in English en {hoja}")
            continue

        if "ENERC(kcal) (original)" not in df.columns:
            print(f"⚠️ Falta ENERC(kcal) (original) en {hoja}")
            continue

        df_sel = df[[
            "Food name in English",
            "ENERC(kcal) (original)"
        ]].copy()

        df_sel.columns = ["alimento", "kcal"]
        df_sel["origen"] = "FAO"
        df_sel["hoja"] = hoja

        registros.append(df_sel)

        print(f"✔ Procesada hoja: {hoja}")

    except Exception as e:
        print(f"❌ Error en {archivo} / {hoja}: {e}")

# Unificar
if registros:
    df_final = pd.concat(registros, ignore_index=True)

    df_final = df_final.dropna(subset=["alimento", "kcal"])
    df_final["alimento"] = df_final["alimento"].astype(str).str.strip()

    df_final.to_csv(SALIDA, index=False, encoding="utf-8-sig")

    print(f"\n✅ Archivo generado: {SALIDA}")
    print(f"📊 Registros: {len(df_final)}")
else:
    print("\n❌ No se generaron registros")
