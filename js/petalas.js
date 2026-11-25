(function () {
  const canvas = document.getElementById("petalas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Respeita quem prefere menos animação
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let largura, altura;
  const mouse = { x: -9999, y: -9999 };
  const RAIO = 130;
  const CORES = ["#f9cdd6", "#f4b6c2", "#ee9fb0", "#fbe0e6", "#f7bfcb"];
  const petalas = [];
  const QUANTIDADE = window.innerWidth < 700 ? 25 : 55;

  function ajustar() {
    const dpr = window.devicePixelRatio || 1;
    largura = window.innerWidth;
    altura = window.innerHeight;
    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    canvas.style.width = largura + "px";
    canvas.style.height = altura + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function aleatorio(min, max) {
    return Math.random() * (max - min) + min;
  }

  function criarPetala(noTopo) {
    return {
      x: aleatorio(0, largura),
      y: noTopo ? aleatorio(-80, -10) : aleatorio(-20, altura),
      tamanho: aleatorio(6, 14),
      vx: 0,
      vy: aleatorio(0.5, 1.4),
      baseVy: 0,
      rot: aleatorio(0, Math.PI * 2),
      vrot: aleatorio(-0.02, 0.02),
      fase: aleatorio(0, Math.PI * 2),
      cor: CORES[Math.floor(Math.random() * CORES.length)],
      opacidade: aleatorio(0.55, 0.95),
    };
  }

  function desenhar(p) {
    const s = p.tamanho;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.opacidade;
    ctx.fillStyle = p.cor;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.9, -s * 0.7, s * 0.8, s * 0.6, 0, s);
    ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s * 0.9, -s * 0.7, 0, -s);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function atualizar(p, t) {
    // Balanço suave com o vento
    p.x += p.vx + Math.sin(t * 0.001 + p.fase) * 0.6;
    p.y += p.vy + p.baseVy;
    p.rot += p.vrot;

    // Foge do mouse
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < RAIO && dist > 0) {
      const forca = (RAIO - dist) / RAIO;
      p.vx += (dx / dist) * forca * 0.9;
      p.baseVy += (dy / dist) * forca * 0.5;
      p.vrot += (Math.random() - 0.5) * 0.01;
    }

    // Vai freando o impulso do mouse
    p.vx *= 0.95;
    p.baseVy *= 0.95;

    // Reaparece no topo
    if (p.y > altura + 20 || p.x < -40 || p.x > largura + 40) {
      Object.assign(p, criarPetala(true));
    }
  }

  function animar(t) {
    ctx.clearRect(0, 0, largura, altura);
    for (const p of petalas) {
      atualizar(p, t);
      desenhar(p);
    }
    requestAnimationFrame(animar);
  }

  window.addEventListener("resize", ajustar);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener(
    "touchmove",
    (e) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    },
    { passive: true }
  );
  window.addEventListener("mouseout", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  ajustar();
  for (let i = 0; i < QUANTIDADE; i++) petalas.push(criarPetala(false));
  requestAnimationFrame(animar);
})();
