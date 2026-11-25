(function () {
  const raiz = document.documentElement;

  // Reflexo de luz do fundo espelhado segue o mouse
  function moverLuz(x, y) {
    const px = (x / window.innerWidth) * 100;
    const py = (y / window.innerHeight) * 100;
    raiz.style.setProperty("--mx", px + "%");
    raiz.style.setProperty("--my", py + "%");
    raiz.style.setProperty("--deslocar", (x / window.innerWidth - 0.5) * 120 + "px");
  }

  window.addEventListener("mousemove", (e) => moverLuz(e.clientX, e.clientY));
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      moverLuz(t.clientX, t.clientY);
    },
    { passive: true }
  );

  // Efeito 3D nos cards do cardápio
  const lista = document.getElementById("lista-cardapio");
  if (lista) {
    lista.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "perspective(700px) rotateX(" + -y * 8 + "deg) rotateY(" + x * 8 + "deg) translateY(-4px)";
    });

    lista.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".card");
      if (card) card.style.transform = "";
    });
  }
})();
