let datos = [];

const input = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const tbody = document.querySelector("#dataTable tbody");

// Cargar CSV
fetch("creditos_alimentos.csv")
  .then(res => res.text())
  .then(texto => {
    const lineas = texto.trim().split("\n");
    lineas.shift(); // quitar encabezado

    datos = lineas.map(linea => {
      const c = linea.split(",");
      return {
        alimento: c[0],
        porcion: c[1],
        creditoPorcion: c[2],
        credito100g: c[3]
      };
    });
  });

// Búsqueda parcial
input.addEventListener("input", () => {
  const texto = input.value.toLowerCase();
  tbody.innerHTML = "";

  if (texto === "") return;

  datos
    .filter(d => d.alimento.toLowerCase().includes(texto))
    .forEach(d => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.alimento}</td>
        <td>${d.porcion}</td>
        <td>${d.creditoPorcion}</td>
        <td>${d.credito100g}</td>
      `;
      tbody.appendChild(tr);
    });
});

// Botón limpiar
clearBtn.addEventListener("click", () => {
  input.value = "";
  tbody.innerHTML = "";
  input.focus();
});
