let alimentos = [];

const input = document.getElementById("buscador");
const resultados = document.getElementById("resultados");
const estado = document.getElementById("estado");

fetch("alimentos.json")
  .then(res => res.json())
  .then(data => {
    alimentos = Array.isArray(data) ? data : [];
    estado.textContent = "Escribí al menos 2 letras para buscar.";
  })
  .catch(() => {
    estado.textContent = "Error cargando los datos.";
  });

input.addEventListener("input", () => {
  const texto = input.value.toLowerCase().trim();
  resultados.innerHTML = "";

  if (texto.length < 2) {
    estado.textContent = "Escribí al menos 2 letras para buscar.";
    return;
  }

  const encontrados = alimentos.filter(a =>
    a.nombre && a.nombre.toLowerCase().includes(texto)
  );

  if (encontrados.length === 0) {
    estado.textContent = "No se encontraron alimentos.";
    return;
  }

  estado.textContent = `Resultados encontrados: ${encontrados.length}`;

  encontrados.forEach(a => {
    const li = document.createElement("li");

    const clase =
      a.calidad && typeof a.calidad === "string"
        ? a.calidad.toLowerCase()
        : "sin-dato";

    const creditosTexto = a.creditos_por_porcion
      ? `${a.creditos_por_porcion} créditos`
      : "Sin dato";

    li.innerHTML = `
      <a href="creditos/${a.id}.html" class="item">
        <div class="nombre">${a.nombre}</div>
        <div class="porcion">${a.porcion || ""}</div>
        <div class="creditos ${clase}">
          ${creditosTexto}
        </div>
      </a>
    `;

    resultados.appendChild(li);
  });
});
