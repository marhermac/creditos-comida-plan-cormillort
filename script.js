document.addEventListener("DOMContentLoaded", () => {

  let datos = [];

  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");
  const tbody = document.querySelector("#dataTable tbody");

  // Cargar CSV
  fetch("alimentos.json")
  .then(res => res.json())
  .then(data => {
    const input = document.getElementById("buscador");
    const resultados = document.getElementById("resultados");

    input.addEventListener("input", () => {
      const q = input.value.toLowerCase();
      resultados.innerHTML = "";

      if (q.length < 2) return;

      data
        .filter(a => a.nombre.toLowerCase().includes(q))
        .slice(0, 20)
        .forEach(a => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="creditos/${a.nombre
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}.html">
            ${a.nombre} – ${a.creditos} créditos
          </a>`;
          resultados.appendChild(li);
        });
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
          <td style="background:${bgColor}; font-weight:600">
            ${d.credito100g}
          </td>
        `;

        tbody.appendChild(tr);
      });
  });

  // Limpiar
  clearBtn.addEventListener("click", () => {
    input.value = "";
    tbody.innerHTML = "";
    input.focus();
  });

});
