let receitas = JSON.parse(localStorage.getItem("receitas")) || [];
let editandoIndex = null;

function abrirFormulario() {
  document.getElementById("formulario").style.display = "block";
}

function fecharFormulario() {
  document.getElementById("formulario").style.display = "none";
  limparFormulario();
}

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("ingredientes").value = "";
  document.getElementById("modo").value = "";
  document.getElementById("categoria").value = "Doces";
  document.getElementById("imagem").value = "";
  editandoIndex = null;
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

    const novaReceita = { nome, ingredientes, modo, categoria, imagem };

    if (editandoIndex !== null) {
      receitas[editandoIndex] = novaReceita;
    } else {
      receitas.push(novaReceita);
    }

    localStorage.setItem("receitas", JSON.stringify(receitas));
    fecharFormulario();
    renderizar();
  };

  if (imagemInput.files[0]) {
    reader.readAsDataURL(imagemInput.files[0]);
  } else {
    const novaReceita = {
      nome,
      ingredientes,
      modo,
      categoria,
      imagem: receitas[editandoIndex]?.imagem || null
    };

    if (editandoIndex !== null) {
      receitas[editandoIndex] = novaReceita;
    } else {
      receitas.push(novaReceita);
    }

    localStorage.setItem("receitas", JSON.stringify(receitas));
    fecharFormulario();
    renderizar();
  }
}

function excluirReceita(index) {
  if (confirm("Deseja excluir esta receita?")) {
    receitas.splice(index, 1);
    localStorage.setItem("receitas", JSON.stringify(receitas));
    renderizar();
  }
}

function editarReceita(index) {
  const r = receitas[index];

  document.getElementById("nome").value = r.nome;
  document.getElementById("ingredientes").value = r.ingredientes;
  document.getElementById("modo").value = r.modo;
  document.getElementById("categoria").value = r.categoria;

  editandoIndex = index;
  abrirFormulario();
}

function renderizar() {
  const main = document.getElementById("categorias");
  main.innerHTML = "";

  receitas.forEach((r, index) => {
    const div = document.createElement("div");
    div.className = "receita";

    div.innerHTML = `
      <h3>${r.nome}</h3>
      ${r.imagem ? `<img src="${r.imagem}">` : ""}
      <p><strong>Ingredientes:</strong><br>${r.ingredientes}</p>
      <p><strong>Modo de preparo:</strong><br>${r.modo}</p>
      <button onclick="editarReceita(${index})">✏ Editar</button>
      <button onclick="excluirReceita(${index})">🗑 Excluir</button>
    `;

    main.appendChild(div);
  });
}

renderizar();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

