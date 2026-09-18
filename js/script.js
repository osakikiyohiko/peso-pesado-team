document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const WHATSAPP_NUMBER = '5511994099317';

const scheduleBtn = document.getElementById('scheduleBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const scheduleForm = document.getElementById('scheduleForm');

function openModal() {
  modalOverlay.classList.add('open');
  document.getElementById('nome').focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

scheduleBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalOverlay.classList.contains('open')) {
    closeModal();
  }
});

scheduleForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();

  const mensagem =
    'Olá! Gostaria de agendar uma aula experimental gratuita.\n\n' +
    `Nome: ${nome}\n` +
    `Telefone: ${telefone}\n` +
    `E-mail: ${email}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');

  scheduleForm.reset();
  closeModal();
});
