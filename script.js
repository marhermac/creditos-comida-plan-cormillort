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
    lineas.shift(); // encabezado

    datos = lineas.map(linea => {
      const c = linea.split(",");
      return {
        alimento: c[0],
        porcion: c[1],
        creditoPorcion: c[2],
        credito100g: c[3],
        color: c[4].toLowerCase() // rojo / verde / amarillo
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

      const bgColor =
        d.color === "verde" ? "#b6f2c2" :
        d.color === "amarillo" ? "#ffe5a0" :
        d.color === "rojo" ? "#ffb3b3" :
        "#eee";

      tr.innerHTML = `
        <td>${d.alimento}</td>
        <td>${d.porcion}</td>
        <td>${d.creditoPorcion}</td>
        <td style="background:${bgColor}">${d.credito100g}</td>
      `;

      tr.addEventListener("click", () => {
        mostrarPopup(d, bgColor);
      });

      tbody.appendChild(tr);
    });
});

// Limpiar
clearBtn.addEventListener("click", () => {
  input.value = "";
  tbody.innerHTML = "";
  popup.style.display = "none"; // 👈 cierra el popup
});

// Popup
function mostrarPopup(dato, color) {
  popup.innerHTML = `
    <strong>${dato.alimento}</strong><br>
    Porción: ${dato.porcion}<br>
    Créditos por porción: ${dato.creditoPorcion}<br>
    Crédito por 100g: ${dato.credito100g}<br>
    Color: ${dato.color}
  `;
  popup.style.background = color;
  popup.style.display = "block";
}
