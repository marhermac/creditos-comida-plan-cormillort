let datos = [];

fetch("creditos_alimentos3.csv")
  .then(response => response.text())
  .then(texto => {
    const lineas = texto.trim().split("\n");
    lineas.shift(); // elimina encabezado

    datos = lineas.map(linea => {
      const columnas = linea.split(",");
      return {
        alimento: columnas[0],
        porcion: columnas[1],
        creditoPorcion: columnas[2],
        credito100g: columnas[3]
      };
    });
  });

const input = document.getElementById("buscador");
const tbody = document.querySelector("tbody");

input.addEventListener("input", () => {
  const texto = input.value.toLowerCase();
  tbody.innerHTML = "";

  datos
    .filter(d => d.alimento.toLowerCase().includes(texto))
    .forEach(d => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${d.alimento}</td>
        <td>${d.porcion}</td>
        <td>${d.creditoPorcion}</td>
        <td>${d.credito100g}</td>
      `;
      tbody.appendChild(fila);
    });
});

function limpiarBusqueda() {
  input.value = "";
  tbody.innerHTML = "";
}
