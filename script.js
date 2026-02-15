let receitas = JSON.parse(localStorage.getItem("receitas")) || [];

function abrirFormulario() {
  document.getElementById("formulario").style.display = "block";
}

function fecharFormulario() {
  document.getElementById("formulario").style.display = "none";
}

function salvarReceita() {
  const nome = document.getElementById("nome").value;
  const ingredientes = document.getElementById("ingredientes").value;
  const modo = document.getElementById("modo").value;
  const categoria = document.getElementById("categoria").value;
  const imagemInput = document.getElementById("imagem");

  const reader = new FileReader();
  reader.onload = function() {
    const imagem = reader.result;

    receitas.push({ nome, ingredientes, modo, categoria, imagem });
    localStorage.setItem("receitas", JSON.stringify(receitas));

    fecharFormulario();
    renderizar();
  };

  if (imagemInput.files[0]) {
    reader.readAsDataURL(imagemInput.files[0]);
  } else {
    receitas.push({ nome, ingredientes, modo, categoria, imagem: null });
    localStorage.setItem("receitas", JSON.stringify(receitas));
    fecharFormulario();
    renderizar();
  }
}

function renderizar() {
  const main = document.getElementById("categorias");
  main.innerHTML = "";

  const categorias = [...new Set(receitas.map(r => r.categoria))];

  categorias.forEach(cat => {
    const h2 = document.createElement("h2");
    h2.textContent = cat;
    main.appendChild(h2);

    receitas
      .filter(r => r.categoria === cat)
      .forEach(r => {
        const div = document.createElement("div");
        div.className = "receita";
        div.innerHTML = `
          <h3>${r.nome}</h3>
          ${r.imagem ? `<img src="${r.imagem}">` : ""}
          <p><strong>Ingredientes:</strong><br>${r.ingredientes}</p>
          <p><strong>Modo de preparo:</strong><br>${r.modo}</p>
        `;
        main.appendChild(div);
      });
  });
}

renderizar();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
