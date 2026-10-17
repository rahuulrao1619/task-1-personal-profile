document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navWrap = document.querySelector('.nav-wrap');
  const navLinks = document.querySelectorAll('.nav-links a');
  const typingElement = document.querySelector('.typing');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('.form-status');

  const roles = ['Information Science Student', 'AI Enthusiast', 'Frontend Learner', 'Backend Explorer', 'Problem Solver'];
  let roleIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const typeRole = () => {
    const role = roles[roleIndex];
    typingElement.textContent = deleting ? role.slice(0, characterIndex--) : role.slice(0, characterIndex++);
    let delay = deleting ? 42 : 78;
    if (!deleting && characterIndex > role.length) {
      delay = 1450;
      deleting = true;
    } else if (deleting && characterIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      characterIndex = 0;
      delay = 300;
    }
    window.setTimeout(typeRole, delay);
  };
  typeRole();

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 25);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuToggle.addEventListener('click', () => {
    const isOpen = navWrap.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    navWrap.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  document.querySelectorAll('.button').forEach(button => button.addEventListener('click', event => {
    const ripple = event.currentTarget;
    ripple.classList.remove('ripple');
    window.requestAnimationFrame(() => ripple.classList.add('ripple'));
  }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      status.textContent = 'Please complete all fields before sending.';
      status.style.color = '#f87171';
      return;
    }
    if (!email.validity.valid) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#f87171';
      email.focus();
      return;
    }
    status.textContent = `Thanks, ${name.value.trim()}! Your message is ready to send.`;
    status.style.color = '#a78bfa';
    form.reset();
  });
});