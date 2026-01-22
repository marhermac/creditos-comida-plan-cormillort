document.addEventListener("DOMContentLoaded", () => {
  fetch("alimentos.json")
    .then(res => res.json())
    .then(data => {
      const input = document.getElementById("buscador");
      const resultados = document.getElementById("resultados");

      input.addEventListener("input", () => {
        const q = input.value.toLowerCase().trim();
        resultados.innerHTML = "";

        if (q.length < 2) return;

        data
          .filter(a => a.nombre.toLowerCase().includes(q))
          .slice(0, 20)
          .forEach(a => {
            const slug = a.nombre
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");

            const li = document.createElement("li");
            li.innerHTML = `
              <a href="creditos/${slug}.html">
                ${a.nombre} – ${a.creditos} créditos
              </a>
            `;
            resultados.appendChild(li);
          });
      });
    })
    .catch(err => {
      console.error("Error cargando alimentos.json", err);
    });
});

