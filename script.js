const input = document.getElementById("searchInput");
const tableBody = document.querySelector("#dataTable tbody");
const suggestions = document.getElementById("suggestions");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const close = document.getElementById("close");

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
  suggestions.innerHTML = "";
  const valor = input.value.toLowerCase();

  alimentos
    .filter(a => a.toLowerCase().startsWith(valor))
    .forEach(a => {
      const option = document.createElement("option");
      option.value = a;
      suggestions.appendChild(option);
    });
});

// 🔹 Buscar, resaltar y mostrar popup
input.addEventListener("input", () => {
  let encontrado = false;

  [...tableBody.rows].forEach(row => {
    row.classList.remove("highlight");

    if (
      row.cells[0]
        .textContent
        .toLowerCase()
        .includes(input.value.toLowerCase()) &&
      input.value !== ""
    ) {
      row.classList.add("highlight");
      encontrado = true;
    }
  });
});


   

      modalText.innerHTML = `
        <strong>${row.cells[0].textContent}</strong><br><br>
        Porción: ${row.cells[1].textContent}<br>
        Crédito por porción: ${row.cells[2].textContent}<br>
        Crédito por 100g: ${row.cells[3].textContent}
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





