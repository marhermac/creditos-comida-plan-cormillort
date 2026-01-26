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

  const claseColor =
    a.calidad && typeof a.calidad === "string"
      ? a.calidad.trim().toLowerCase()
      : "sin-dato";

  const creditosTexto = a.creditos_por_porcion
    ? `Créditos por porción: ${a.creditos_por_porcion}`
    : "Créditos: sin dato";

  li.className = `item ${claseColor}`;

  li.innerHTML = `
    <a href="alimento.html?nombre=${encodeURIComponent(a.Alimento)}" class="item-link">
      <h3>${a.Alimento}</h3>

      <p><strong>Porción:</strong> ${a.PORCION ?? "Sin dato"}</p>
      <p><strong>${creditosTexto}</strong></p>
      <p><strong>Créditos cada 100 g:</strong> ${a.creditos_cada_100g ?? "Sin dato"}</p>

      <div class="leyenda">
        <small>
          📌 <strong>Información importante:</strong><br>
          Los datos nutricionales provienen de bases públicas oficiales
          (ArgenFood y fuentes reconocidas) y fueron procesados con fines informativos.<br><br>

          Los créditos alimentarios se calcularon según el
          <em>Sistema C del Dr. Alberto Cormillot</em>,
          utilizando porciones estándar y valores promedio.<br><br>

          <strong>Valores orientativos.</strong>
          No reemplazan el asesoramiento de un profesional de la salud.
          Ante cualquier duda, consulte con su médico o nutricionista.
        </small>
      </div>
    </a>
  `;

  resultados.appendChild(li);
});
