(function () {
  const form = document.getElementById("form-reserva");
  const msg = document.getElementById("msg-reserva");
  if (!form) return;

  // Não deixa escolher data passada
  const campoData = form.querySelector('input[name="data"]');
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  campoData.min = ano + "-" + mes + "-" + dia;

  function mostrarMensagem(texto, tipo) {
    msg.textContent = texto;
    msg.className = "mensagem " + tipo;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = new FormData(form);
    const reserva = {
      nome: dados.get("nome").trim(),
      telefone: dados.get("telefone").trim(),
      data: dados.get("data"),
      horario: dados.get("horario"),
      pessoas: parseInt(dados.get("pessoas"), 10),
    };

    if (!reserva.nome || !reserva.telefone || !reserva.data || !reserva.horario) {
      mostrarMensagem("Preencha todos os campos.", "erro");
      return;
    }
    if (!(reserva.pessoas >= 1 && reserva.pessoas <= 20)) {
      mostrarMensagem("Informe entre 1 e 20 pessoas.", "erro");
      return;
    }

    const botao = form.querySelector("button[type='submit']");
    botao.disabled = true;
    mostrarMensagem("Enviando...", "");

    const { error } = await window.db.from("reservas").insert(reserva);

    botao.disabled = false;

    if (error) {
      console.error("Erro ao reservar:", error.message);
      mostrarMensagem("Não foi possível reservar agora. Tente novamente.", "erro");
      return;
    }

    form.reset();
    mostrarMensagem("Reserva enviada! Entraremos em contato para confirmar. 桜", "ok");
  });
})();
