(function () {
  const lista = document.getElementById("lista-cardapio");
  const filtros = document.getElementById("filtros");
  if (!lista || !filtros) return;

  let pratos = [];
  let categoriaAtual = "Todos";

  function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function criarCard(prato) {
    const card = document.createElement("article");
    card.className = "card";

    const cat = document.createElement("span");
    cat.className = "categoria";
    cat.textContent = prato.categoria;

    const titulo = document.createElement("h3");
    titulo.textContent = prato.nome;

    const desc = document.createElement("p");
    desc.textContent = prato.descricao || "";

    const preco = document.createElement("span");
    preco.className = "preco";
    preco.textContent = formatarPreco(prato.preco);

    card.append(cat, titulo, desc, preco);
    return card;
  }

  function mostrarPratos() {
    lista.replaceChildren();
    const visiveis =
      categoriaAtual === "Todos"
        ? pratos
        : pratos.filter((p) => p.categoria === categoriaAtual);

    if (visiveis.length === 0) {
      const aviso = document.createElement("p");
      aviso.className = "carregando";
      aviso.textContent = "Nenhum prato encontrado.";
      lista.appendChild(aviso);
      return;
    }

    visiveis.forEach((p) => lista.appendChild(criarCard(p)));
  }

  function montarFiltros() {
    filtros.replaceChildren();
    const categorias = ["Todos", ...new Set(pratos.map((p) => p.categoria))];

    categorias.forEach((cat) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = cat;
      if (cat === categoriaAtual) botao.classList.add("ativo");

      botao.addEventListener("click", () => {
        categoriaAtual = cat;
        montarFiltros();
        mostrarPratos();
      });

      filtros.appendChild(botao);
    });
  }

  async function carregarCardapio() {
    const { data, error } = await window.db
      .from("menu_items")
      .select("*")
      .eq("ativo", true)
      .order("categoria")
      .order("nome");

    if (error) {
      lista.replaceChildren();
      const erro = document.createElement("p");
      erro.className = "carregando";
      erro.textContent = "Não foi possível carregar o cardápio agora.";
      lista.appendChild(erro);
      console.error("Erro ao buscar cardápio:", error.message);
      return;
    }

    pratos = data;
    montarFiltros();
    mostrarPratos();
  }

  carregarCardapio();
})();
