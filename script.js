const input = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const tableBody = document.querySelector("#dataTable tbody");

// Cargar CSV
fetch("creditos_alimentos3.csv")
  .then(res => res.text())
  .then(texto => cargarTabla(texto));

function cargarTabla(csv) {
  const filas = csv.split("\n").slice(1);

  filas.forEach(fila => {
    const col = fila.split(",");

    if (col.length >= 4) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${col[0]}</td>
        <td>${col[1]}</td>
        <td>${col[2]}</td>
        <td>${col[3]}</td>
      `;
      tableBody.appendChild(tr);
    }
  });
}

// BÚSQUEDA PARCIAL
input.addEventListener("input", () => {
  const valor = input.value.toLowerCase();

  [...tableBody.rows].forEach(row => {
    const texto = row.cells[0].textContent.toLowerCase();

    row.classList.remove("highlight");

    if (texto.includes(valor) && valor !== "") {
      row.classList.add("highlight");
    }
  });
});

// BOTÓN LIMPIAR
clearBtn.addEventListener("click", () => {
  input.value = "";

  [...tableBody.rows].forEach(row => {
    row.classList.remove("highlight");
  });
});
