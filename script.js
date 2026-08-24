const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const backTop = document.querySelector('.back-top');
const toast = document.querySelector('.toast');

function closeMenu() {
  nav.classList.remove('open');
  menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  backTop.classList.toggle('show', window.scrollY > 500);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

document.querySelectorAll('.choose-plan').forEach(button => {
  button.addEventListener('click', () => {
    const plan = button.dataset.plan;
    const subject = document.querySelector('[name="assunto"]');
    const message = document.querySelector('[name="mensagem"]');
    subject.value = 'Planos';
    message.value = `Olá! Tenho interesse no ${plan} e gostaria de receber mais informações.`;
    document.querySelector('#contato').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.querySelector('[name="nome"]').focus(), 650);
    showToast(`${plan} selecionado! Complete seus dados.`);
  });
});

document.querySelectorAll('.activity-card a').forEach(link => {
  link.addEventListener('click', event => {
    const activity = event.currentTarget.closest('.activity-card').querySelector('h3').textContent;
    document.querySelector('[name="assunto"]').value = 'Modalidades';
    document.querySelector('[name="mensagem"]').value = `Olá! Gostaria de saber mais sobre a modalidade ${activity}.`;
  });
});

const form = document.querySelector('#contact-form');
function validate(field) {
  const error = field.parentElement.querySelector('.error');
  let message = '';
  if (field.validity.valueMissing) message = 'Este campo é obrigatório.';
  else if (field.validity.typeMismatch) message = 'Informe um e-mail válido.';
  else if (field.validity.tooShort) message = `Digite pelo menos ${field.minLength} caracteres.`;
  field.classList.toggle('invalid', Boolean(message));
  if (error) error.textContent = message;
  return !message;
}

form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('blur', () => validate(field));
  field.addEventListener('input', () => { if (field.classList.contains('invalid')) validate(field); });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, select, textarea')];
  const valid = fields.map(validate).every(Boolean);
  const status = form.querySelector('.form-status');
  if (!valid) {
    status.textContent = 'Revise os campos destacados antes de enviar.';
    form.querySelector('.invalid')?.focus();
    return;
  }
  const name = form.elements.nome.value.trim().split(' ')[0];
  status.textContent = `Obrigado, ${name}! Sua mensagem foi registrada nesta demonstração.`;
  showToast('Mensagem enviada com sucesso!');
  form.reset();
  setTimeout(() => status.textContent = '', 7000);
});

document.querySelector('#year').textContent = new Date().getFullYear();
