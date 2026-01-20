let datos = [];

const input = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const tbody = document.querySelector("#dataTable tbody");

// Popup
const popup = document.createElement("div");
popup.id = "popup";
document.body.appendChild(popup);

// Cargar CSV
fetch("creditos_alimentos.csv")
  .then(res => res.text())
  .then(texto => {
    const lineas = texto.trim().split("\n");
    lineas.shift();

    datos = lineas.map(linea => {
      const c = linea.split(",");
      return {
        alimento: c[0],
        porcion: c[1],
        creditoPorcion: c[2],
        credito100g: c[3],
        grupo: c[4]   // 👉 columna 5
      };
    });
  });

// Buscar
input.addEventListener("input", () => {
  const texto = input.value.toLowerCase();
  tbody.innerHTML = "";
  if (texto === "") return;

  datos
    .filter(d => d.alimento.toLowerCase().includes(texto))
    .forEach(d => {
      const tr = document.createElement("tr");

      // color según columna 5
      let color = "#eee";
      if (d.grupo === "Libre") color = "#b6f2c2";
      if (d.grupo === "Moderado") color = "#ffe5a0";
      if (d.grupo === "Controlado") color = "#ffb3b3";

      tr.innerHTML = `
        <td>${d.alimento}</td>
        <td>${d.porcion}</td>
        <td>${d.creditoPorcion}</td>
        <td style="background:${color}">${d.credito100g}</td>
      `;

      tr.addEventListener("click", () => {
        mostrarPopup(d, color);
      });

      tbody.appendChild(tr);
    });
});

// Limpiar
clearBtn.addEventListener("click", () => {
  input.value = "";
  tbody.innerHTML = "";
  popup.style.display = "none";
});

// Popup
function mostrarPopup(dato, color) {
  popup.innerHTML = `
    <strong>${dato.alimento}</strong><br>
    Porción: ${dato.porcion}<br>
    Créditos: ${dato.creditoPorcion}<br>
    Grupo: ${dato.grupo}
  `;
  popup.style.background = color;
  popup.style.display = "block";
}
