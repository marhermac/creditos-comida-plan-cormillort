const input = document.getElementById("searchInput");
const tableBody = document.querySelector("#dataTable tbody");
const suggestions = document.getElementById("suggestions");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const close = document.getElementById("close");
const clearBtn = document.getElementById("clearBtn");

let alimentos = [];

// 🔹 Cargar CSV
fetch("creditos_alimentos.csv")
  .then(res => res.text())
  .then(texto => cargarDatos(texto))
  .catch(err => console.error("Error al cargar el archivo:", err));

// 🔹 Procesar CSV
function cargarDatos(csv) {
  const filas = csv.split("\n").slice(1); // salta encabezado

  filas.forEach(fila => {
    const col = fila.split(",");

    if (col.length >= 4) {
      const alimento = col[0].trim();
      const porcion = col[1].trim();
      const creditoPorcion = col[2].trim();
      const credito100 = col[3].trim();

      alimentos.push(alimento);

      const tr = document.createElement("tr");
     tr.innerHTML = `
       <td data-label="Alimento">${alimento}</td>
       <td data-label="Porción">${porcion}</td>
       <td data-label="Crédito por porción">${creditoPorcion}</td>
       <td data-label="Crédito por 100g">${credito100}</td>
`;

      tableBody.appendChild(tr);
    }
  });
}

// 🔹 Autocompletado
input.addEventListener("input", () => {
  const valor = input.value.toLowerCase();
  suggestions.innerHTML = "";

  let encontrados = 0;

  [...tableBody.rows].forEach(row => {
    const texto = row.cells[0].textContent.toLowerCase();
    row.classList.remove("highlight");

    // AUTOCOMPLETE
    if (texto.startsWith(valor) && valor !== "") {
      const option = document.createElement("option");
      option.value = row.cells[0].textContent;
      suggestions.appendChild(option);
    }

    // BÚSQUEDA PARCIAL
    if (texto.includes(valor) && valor !== "") {
      row.classList.add("highlight");
      encontrados++;
    }
  });

  // POPUP solo si hay 1 resultado exacto
  if (encontrados === 1 && valor !== "") {
    const fila = [...tableBody.rows].find(row =>
      row.cells[0].textContent.toLowerCase().includes(valor)
    );

    modalText.innerHTML = `
      <strong>${fila.cells[0].textContent}</strong><br><br>
      Porción: ${fila.cells[1].textContent}<br>
      Crédito por porción: ${fila.cells[2].textContent}<br>
      Crédito por 100g: ${fila.cells[3].textContent}
    `;
    modal.style.display = "block";
  }
});
 

  if (!encontrado) {
    modalText.textContent = "No se encontró el alimento buscado";
    modal.style.display = "block";
  }
});

// 🔹 Cerrar modal
close.onclick = () => modal.style.display = "none";
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

clearBtn.addEventListener("click", () => {
  input.value = "";
  suggestions.innerHTML = "";

  [...tableBody.rows].forEach(row => {
    row.classList.remove("highlight");
  });
});






