import os
from datetime import datetime

BASE_URL = "https://marhermac.github.io/creditos-comida-plan-cormillort"

urls = []

# Home
urls.append(f"{BASE_URL}/")

# Páginas de créditos
creditos_dir = "creditos"
for file in os.listdir(creditos_dir):
    if file.endswith(".html"):
        urls.append(f"{BASE_URL}/creditos/{file}")

today = datetime.today().strftime("%Y-%m-%d")

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')

    for url in urls:
        f.write("  <url>\n")
        f.write(f"    <loc>{url}</loc>\n")
        f.write(f"    <lastmod>{today}</lastmod>\n")
        f.write("    <changefreq>monthly</changefreq>\n")
        f.write("    <priority>0.8</priority>\n")
        f.write("  </url>\n")

    f.write("</urlset>")

print(f"Sitemap generado con {len(urls)} URLs")
