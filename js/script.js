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

const isEnglish = document.documentElement.lang.startsWith('en');

// Número guardado em base64 para não aparecer em texto puro para robôs que leem o código.
const WHATSAPP_NUMBER = atob('NTUxMTk5NDA5OTMxNw==');
const WHATSAPP_DISPLAY = `(${WHATSAPP_NUMBER.slice(2, 4)}) ${WHATSAPP_NUMBER.slice(4, 9)}-${WHATSAPP_NUMBER.slice(9)}`;

const CONTACT_URLS = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  'instagram-qg': 'https://instagram.com/qg_peso_pesado',
  'instagram-team': 'https://instagram.com/peso_pesado_team',
  facebook: 'https://www.facebook.com/QGPesoPesado',
};

// Verificação anti-robô (Cloudflare Turnstile)
// Site key pública do widget criado no painel da Cloudflare; só funciona nos domínios cadastrados lá.
const TURNSTILE_SITE_KEY = '0x4AAAAAAFBdflfGJpBXMsuQ';

const VERIFY_TEXTS = isEnglish
  ? {
      title: 'Security Check',
      text: 'Please confirm you are human to access our contact options.',
      error: 'We could not complete the check. Please try again.',
      done: 'Verified! Click below to continue.',
      continue: 'Continue',
      close: 'Close',
    }
  : {
      title: 'Verificação de Segurança',
      text: 'Confirme que você é humano para acessar nossas formas de contato.',
      error: 'Não foi possível concluir a verificação. Tente novamente.',
      done: 'Verificado! Clique abaixo para continuar.',
      continue: 'Continuar',
      close: 'Fechar',
    };

let humanVerified = false;
try {
  humanVerified = sessionStorage.getItem('humanVerified') === '1';
} catch (error) {
  // Sem acesso ao sessionStorage (ex.: modo privado restrito): verifica a cada visita.
}

function unlockContacts() {
  document.querySelectorAll('.contact-protected').forEach((link) => {
    link.href = CONTACT_URLS[link.dataset.contact];
  });
  document.querySelectorAll('.whatsapp-number').forEach((el) => {
    el.textContent = WHATSAPP_DISPLAY;
  });
}

let verifyOverlay;
let verifyWidget;
let verifyStatus;
let verifyContinue;
let turnstileWidgetId;
let turnstileLoading;
let pendingAction;

function buildVerifyModal() {
  verifyOverlay = document.createElement('div');
  verifyOverlay.className = 'modal-overlay';
  verifyOverlay.innerHTML = `
    <div class="modal verify-modal" role="dialog" aria-modal="true" aria-labelledby="verifyTitle">
      <button type="button" class="modal-close" aria-label="${VERIFY_TEXTS.close}">&times;</button>
      <h3 id="verifyTitle">${VERIFY_TEXTS.title}</h3>
      <p class="verify-text">${VERIFY_TEXTS.text}</p>
      <div class="verify-widget"></div>
      <p class="verify-status" role="status"></p>
      <a class="btn verify-continue" target="_blank" rel="noopener" hidden>${VERIFY_TEXTS.continue}</a>
    </div>`;
  document.body.appendChild(verifyOverlay);

  verifyWidget = verifyOverlay.querySelector('.verify-widget');
  verifyStatus = verifyOverlay.querySelector('.verify-status');
  verifyContinue = verifyOverlay.querySelector('.verify-continue');

  verifyOverlay.querySelector('.modal-close').addEventListener('click', closeVerify);
  verifyOverlay.addEventListener('click', (event) => {
    if (event.target === verifyOverlay) {
      closeVerify();
    }
  });
  verifyContinue.addEventListener('click', closeVerify);
}

function closeVerify() {
  verifyOverlay.classList.remove('open');
}

function loadTurnstile() {
  if (!turnstileLoading) {
    turnstileLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return turnstileLoading;
}

function onVerified() {
  humanVerified = true;
  try {
    sessionStorage.setItem('humanVerified', '1');
  } catch (error) {
    // Ignora: a verificação continua valendo enquanto a página estiver aberta.
  }
  unlockContacts();

  const action = pendingAction;
  pendingAction = null;

  // Links externos precisam de um novo clique da pessoa; abrir sozinho seria bloqueado como pop-up.
  if (typeof action === 'string') {
    verifyStatus.textContent = VERIFY_TEXTS.done;
    verifyContinue.href = action;
    verifyContinue.hidden = false;
  } else {
    closeVerify();
    if (action) {
      action();
    }
  }
}

function showVerifyError() {
  verifyStatus.textContent = VERIFY_TEXTS.error;
}

// Executa a ação direto se a pessoa já foi verificada; senão, abre a verificação antes.
// `action` é uma URL (link externo) ou uma função (ex.: abrir o formulário).
function requireHuman(action) {
  if (humanVerified) {
    if (typeof action === 'function') {
      action();
    }
    return;
  }

  pendingAction = action;
  if (!verifyOverlay) {
    buildVerifyModal();
  }
  navLinks.classList.remove('open');
  verifyStatus.textContent = '';
  verifyContinue.hidden = true;
  verifyOverlay.classList.add('open');

  loadTurnstile()
    .then(() => {
      if (turnstileWidgetId === undefined) {
        turnstileWidgetId = window.turnstile.render(verifyWidget, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          language: isEnglish ? 'en' : 'pt-br',
          callback: onVerified,
          'error-callback': showVerifyError,
          'expired-callback': () => window.turnstile.reset(turnstileWidgetId),
        });
      } else {
        window.turnstile.reset(turnstileWidgetId);
      }
    })
    .catch(showVerifyError);
}

if (humanVerified) {
  unlockContacts();
}

document.querySelectorAll('.contact-protected').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!humanVerified) {
      event.preventDefault();
      requireHuman(CONTACT_URLS[link.dataset.contact]);
    }
  });
});

const scheduleTriggers = document.querySelectorAll('.schedule-trigger');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const scheduleForm = document.getElementById('scheduleForm');

function openModal() {
  navLinks.classList.remove('open');
  modalOverlay.classList.add('open');
  document.getElementById('nome').focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }
  if (verifyOverlay && verifyOverlay.classList.contains('open')) {
    closeVerify();
  } else if (modalOverlay && modalOverlay.classList.contains('open')) {
    closeModal();
  }
});

if (scheduleTriggers.length) {
  scheduleTriggers.forEach((trigger) => trigger.addEventListener('click', () => requireHuman(openModal)));
  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  scheduleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();

    const mensagem = isEnglish
      ? 'Hello! I would like to schedule a free trial class.\n\n' +
        `Name: ${nome}\n` +
        `Phone: ${telefone}\n` +
        `E-mail: ${email}`
      : 'Olá! Gostaria de agendar uma aula experimental gratuita.\n\n' +
        `Nome: ${nome}\n` +
        `Telefone: ${telefone}\n` +
        `E-mail: ${email}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    scheduleForm.reset();
    closeModal();
  });
}
