import pandas as pd
import json
from pathlib import Path
import shutil
from datetime import datetime

# =========================
# RUTAS BASE
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

ORIGEN = BASE_DIR / "nutricion" / "origen"
ARGENFOOD = ORIGEN / "argenfood"
FAO = ORIGEN / "fao"
OTROS = ORIGEN / "otros"

SALIDA = BASE_DIR / "creditos"
BACKUP = SALIDA / "backup_jsons"

SALIDA.mkdir(exist_ok=True)
BACKUP.mkdir(exist_ok=True)

# =========================
# BACKUP DE JSON VIEJOS
# =========================
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

for archivo in SALIDA.glob("*.json"):
    shutil.move(
        archivo,
        BACKUP / f"{archivo.stem}_{timestamp}.json"
    )

print("✅ JSON antiguos movidos a backup_jsons/")

# =========================
# CARGA DE CSV
# =========================
csv_argen = ARGENFOOD / "argenfood_con_creditos_porciones.csv"
csv_fao = FAO / "fao_con_creditos.csv"
csv_otros = OTROS / "otros_con_creditos.csv"

dfs = []

if csv_argen.exists():
    df = pd.read_csv(csv_argen)
    df["origen"] = "argenfood"
    dfs.append(df)

if csv_fao.exists():
    df = pd.read_csv(csv_fao)
    df["origen"] = "fao"
    dfs.append(df)

if csv_otros.exists():
    df = pd.read_csv(csv_otros)
    df["origen"] = "otros"
    dfs.append(df)

if not dfs:
    raise FileNotFoundError("❌ No se encontró ningún CSV para procesar")

# =========================
# UNIFICAR DATA
# =========================
df_final = pd.concat(dfs, ignore_index=True)

# =========================
# EXPORTAR JSON
# =========================
json_salida = SALIDA / "alimentos.json"

with open(json_salida, "w", encoding="utf-8") as f:
    json.dump(
        df_final.to_dict(orient="records"),
        f,
        ensure_ascii=False,
        indent=2
    )

print(f"✅ JSON generado correctamente: {json_salida}")
print(f"📊 Registros totales: {len(df_final)}")
