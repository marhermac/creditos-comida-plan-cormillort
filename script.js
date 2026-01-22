let alimentos = [];

const input = document.getElementById("buscador");
const resultados = document.getElementById("resultados");
const estado = document.getElementById("estado");

// Cargar datos
fetch("alimentos.json")
  .then(res => res.json())
  .then(data => {
    alimentos = data;
    estado.textContent = "Escribí al menos 2 letras para buscar.";
  })
  .catch(() => {
    estado.textContent = "Error cargando los datos.";
  });

// Buscar mientras escribe
input.addEventListener("input", () => {
  const texto = input.value.toLowerCase().trim();
  resultados.innerHTML = "";

  if (texto.length < 2) {
    estado.textContent = "Escribí al menos 2 letras para buscar.";
    return;
  }

  const encontrados = alimentos.filter(a =>
    a.nombre.toLowerCase().includes(texto)
  );

  if (encontrados.length === 0) {
    estado.textContent = "No se encontraron alimentos.";
    return;
  }

  estado.textContent = `Resultados encontrados: ${encontrados.length}`;

  encontrados.forEach(a => {
    const li = document.createElement("li");

    li.innerHTML = `
      <a href="creditos/${a.id}.html">
        <strong>${a.nombre}</strong><br>
        <span>${a.porcion || ""}</span>
      </a>
    `;

    resultados.appendChild(li);
  });
});

