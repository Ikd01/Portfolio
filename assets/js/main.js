const LANG_KEY = "portfolio_lang";

const state = {
  content: null,
  lang: localStorage.getItem(LANG_KEY) || "es"
};

const el = {
  html: document.documentElement,
  orbCanvas: document.getElementById("orbCanvas"),
  brandName: document.getElementById("brandName"),
  langToggle: document.getElementById("langToggle"),
  menuToggle: document.getElementById("menuToggle"),
  siteNav: document.getElementById("siteNav"),
  heroLocation: document.getElementById("heroLocation"),
  heroName: document.getElementById("heroName"),
  heroRole: document.getElementById("heroRole"),
  heroTagline: document.getElementById("heroTagline"),
  heroPrimaryCta: document.getElementById("heroPrimaryCta"),
  heroSecondaryCta: document.getElementById("heroSecondaryCta"),
  heroSocials: document.getElementById("heroSocials"),
  aboutKicker: document.getElementById("aboutKicker"),
  aboutTitle: document.getElementById("aboutTitle"),
  aboutText: document.getElementById("aboutText"),
  skillsKicker: document.getElementById("skillsKicker"),
  skillsTitle: document.getElementById("skillsTitle"),
  skillsGrid: document.getElementById("skillsGrid"),
  educationKicker: document.getElementById("educationKicker"),
  educationTitle: document.getElementById("educationTitle"),
  educationTimeline: document.getElementById("educationTimeline"),
  projectsKicker: document.getElementById("projectsKicker"),
  projectsTitle: document.getElementById("projectsTitle"),
  projectsGrid: document.getElementById("projectsGrid"),
  contactKicker: document.getElementById("contactKicker"),
  contactTitle: document.getElementById("contactTitle"),
  contactLead: document.getElementById("contactLead"),
  contactMeta: document.getElementById("contactMeta"),
  contactForm: document.getElementById("contactForm"),
  labelName: document.getElementById("labelName"),
  labelEmail: document.getElementById("labelEmail"),
  labelMessage: document.getElementById("labelMessage"),
  sendButton: document.getElementById("sendButton"),
  formFeedback: document.getElementById("formFeedback"),
  footerCopy: document.getElementById("footerCopy"),
  toTop: document.getElementById("toTop")
};

function t(value, lang = state.lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.es || "";
}

function langLabel(lang = state.lang) {
  return lang === "es" ? "EN" : "ES";
}

function updateLangUI() {
  el.langToggle.textContent = langLabel();
  el.html.lang = state.lang;
  localStorage.setItem(LANG_KEY, state.lang);
}

function navText() {
  if (state.lang === "es") {
    return {
      home: "Home",
      about: "Sobre mí",
      skills: "Skills",
      education: "Estudios",
      projects: "Proyectos",
      contact: "Contacto"
    };
  }
  return {
    home: "Home",
    about: "About",
    skills: "Skills",
    education: "Education",
    projects: "Projects",
    contact: "Contact"
  };
}

function renderNav() {
  const labels = navText();
  document.querySelectorAll("#siteNav a[data-nav]").forEach((link) => {
    const key = link.dataset.nav;
    link.textContent = labels[key] || key;
  });
}

function renderHero() {
  const { meta, ui } = state.content;
  document.title = `${meta.name} | ${meta.role}`;
  el.brandName.textContent = meta.name;
  el.heroLocation.textContent = meta.location;
  el.heroName.textContent = meta.name;
  el.heroRole.textContent = meta.role;
  el.heroTagline.textContent = t(meta.tagline);
  el.heroPrimaryCta.textContent = t(ui.ctaProjects);
  el.heroSecondaryCta.textContent = t(ui.ctaContact);

  el.heroSocials.innerHTML = "";
  meta.socials.forEach((social) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "social-link";
    a.href = social.url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = social.label;
    li.appendChild(a);
    el.heroSocials.appendChild(li);
  });
}

function renderAbout() {
  const { about, ui } = state.content;
  el.aboutKicker.textContent = t(ui.aboutKicker);
  el.aboutTitle.textContent = t(ui.aboutTitle);
  el.aboutText.textContent = t(about.text);
}

function renderSkills() {
  const { skills, ui } = state.content;
  el.skillsKicker.textContent = t(ui.skillsKicker);
  el.skillsTitle.textContent = t(ui.skillsTitle);
  el.skillsGrid.innerHTML = "";

  skills.forEach((group) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = t(group.category);

    const chips = document.createElement("div");
    chips.className = "chip-list";

    group.items.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item.level ? `${item.name} - ${item.level}` : item.name;
      chips.appendChild(chip);
    });

    card.append(title, chips);
    el.skillsGrid.appendChild(card);
  });
}

function renderEducation() {
  const { education, ui } = state.content;
  el.educationKicker.textContent = t(ui.educationKicker);
  el.educationTitle.textContent = t(ui.educationTitle);
  el.educationTimeline.innerHTML = "";

  education.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "timeline-item";

    const top = document.createElement("div");
    top.className = "timeline-top";

    const heading = document.createElement("h3");
    heading.textContent = entry.title;

    const date = document.createElement("span");
    date.className = "timeline-date";
    date.textContent = entry.date;

    top.append(heading, date);

    const institute = document.createElement("p");
    institute.className = "lead";
    institute.textContent = entry.institution;

    const desc = document.createElement("p");
    desc.textContent = t(entry.description);

    item.append(top, institute, desc);
    el.educationTimeline.appendChild(item);
  });
}

function buildProjectLinks(project, labels) {
  const wrapper = document.createElement("div");
  wrapper.className = "project-links";

  if (project.demoUrl) {
    const demo = document.createElement("a");
    demo.className = "project-link";
    demo.textContent = labels.demo;
    demo.href = project.demoUrl;
    demo.target = "_blank";
    demo.rel = "noreferrer";
    wrapper.appendChild(demo);
  }

  if (project.repoUrl) {
    const repo = document.createElement("a");
    repo.className = "project-link";
    repo.textContent = labels.repo;
    repo.href = project.repoUrl;
    repo.target = "_blank";
    repo.rel = "noreferrer";
    wrapper.appendChild(repo);
  }

  return wrapper;
}

function renderProjects() {
  const { projects, ui } = state.content;
  const labels = {
    demo: t(ui.projectDemo),
    repo: t(ui.projectRepo)
  };

  el.projectsKicker.textContent = t(ui.projectsKicker);
  el.projectsTitle.textContent = t(ui.projectsTitle);
  el.projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = `project-card ${project.featured ? "featured" : ""}`.trim();

    const title = document.createElement("h3");
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.className = "lead";
    desc.textContent = t(project.description);

    const stack = document.createElement("div");
    stack.className = "chip-list";
    project.stack.forEach((tech) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = tech;
      stack.appendChild(chip);
    });

    const links = buildProjectLinks(project, labels);
    card.append(title, desc, stack, links);
    el.projectsGrid.appendChild(card);
  });
}

function configureContactForm() {
  const { contact, ui } = state.content;

  el.contactKicker.textContent = t(ui.contactKicker);
  el.contactTitle.textContent = t(ui.contactTitle);
  el.contactLead.textContent = t(ui.contactLead);

  el.labelName.textContent = t(ui.formName);
  el.labelEmail.textContent = t(ui.formEmail);
  el.labelMessage.textContent = t(ui.formMessage);
  el.sendButton.textContent = t(ui.formSubmit);

  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const messageInput = document.getElementById("messageInput");

  nameInput.placeholder = t(ui.formNamePlaceholder);
  emailInput.placeholder = t(ui.formEmailPlaceholder);
  messageInput.placeholder = t(ui.formMessagePlaceholder);

  el.contactMeta.innerHTML = "";
  const emailLine = document.createElement("a");
  emailLine.href = `mailto:${contact.email}`;
  emailLine.textContent = contact.email;
  el.contactMeta.appendChild(emailLine);

  if (contact.phone) {
    const phone = document.createElement("a");
    phone.href = `tel:${contact.phone.replace(/\s+/g, "")}`;
    phone.textContent = contact.phone;
    el.contactMeta.appendChild(phone);
  }

  const place = document.createElement("p");
  place.textContent = contact.location;
  el.contactMeta.appendChild(place);
}

function setFeedback(message, type = "") {
  el.formFeedback.textContent = message;
  el.formFeedback.classList.remove("is-error", "is-success");
  if (type === "error") {
    el.formFeedback.classList.add("is-error");
  }
  if (type === "success") {
    el.formFeedback.classList.add("is-success");
  }
}

function validateForm(formData) {
  const { ui } = state.content;
  const name = `${formData.get("name") || ""}`.trim();
  const email = `${formData.get("email") || ""}`.trim();
  const message = `${formData.get("message") || ""}`.trim();

  if (!name || !email || !message) {
    return t(ui.formErrorRequired);
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    return t(ui.formErrorEmail);
  }

  return "";
}

async function sendWithFormspree(formData, contactConfig) {
  const response = await fetch(contactConfig.formspree.endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Formspree request failed");
  }
}

async function sendWithEmailJS(formData, contactConfig) {
  const cfg = contactConfig.emailjs;

  if (!cfg?.serviceId || !cfg?.templateId || !cfg?.publicKey) {
    throw new Error("EmailJS config missing");
  }

  const payload = {
    service_id: cfg.serviceId,
    template_id: cfg.templateId,
    user_id: cfg.publicKey,
    template_params: {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    }
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("EmailJS request failed");
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const { contact, ui } = state.content;
  const formData = new FormData(el.contactForm);

  const validationError = validateForm(formData);
  if (validationError) {
    setFeedback(validationError, "error");
    return;
  }

  setFeedback(t(ui.formSending));
  el.sendButton.disabled = true;

  try {
    if (contact.provider === "emailjs") {
      await sendWithEmailJS(formData, contact);
    } else {
      await sendWithFormspree(formData, contact);
    }

    setFeedback(t(ui.formSuccess), "success");
    el.contactForm.reset();
  } catch {
    setFeedback(t(ui.formErrorSend), "error");
  } finally {
    el.sendButton.disabled = false;
  }
}

function setupNavState() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll("#siteNav a[data-nav]")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", isCurrent);
          });
        }
      });
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupMenu() {
  el.menuToggle.addEventListener("click", () => {
    const expanded = el.menuToggle.getAttribute("aria-expanded") === "true";
    el.menuToggle.setAttribute("aria-expanded", `${!expanded}`);
    el.siteNav.classList.toggle("open", !expanded);
  });

  el.siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      el.siteNav.classList.remove("open");
      el.menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupAnimations() {
  if (!window.gsap) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.from([".eyebrow", "#heroName", "#heroRole", "#heroTagline", ".hero-actions", ".social-list"], {
    y: 20,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    stagger: 0.08
  });

  window.gsap.utils.toArray(".reveal").forEach((section) => {
    window.gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 78%"
      }
    });
  });

  window.gsap.utils.toArray([".card", ".project-card", ".timeline-item"]).forEach((item) => {
    window.gsap.from(item, {
      opacity: 0,
      y: 14,
      duration: 0.55,
      ease: "power1.out",
      scrollTrigger: {
        trigger: item,
        start: "top 88%"
      }
    });
  });
}

function initOrbBackground() {
  const canvas = el.orbCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const palette = [
    "13, 92, 99",
    "186, 63, 29",
    "57, 114, 142",
    "126, 58, 94"
  ];

  const pointer = { x: 0.5, y: 0.5 };
  const orbs = [
    { x: 0.18, y: 0.28, r: 0.24, vx: 0.00042, vy: 0.00027, c: palette[0] },
    { x: 0.72, y: 0.24, r: 0.2, vx: -0.00033, vy: 0.00038, c: palette[1] },
    { x: 0.63, y: 0.72, r: 0.25, vx: 0.0003, vy: -0.00024, c: palette[2] },
    { x: 0.22, y: 0.7, r: 0.18, vx: -0.00024, vy: -0.00035, c: palette[3] }
  ];

  let width = 0;
  let height = 0;
  let raf = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawBackdrop() {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "rgba(246,245,242,0.92)");
    bg.addColorStop(1, "rgba(240,237,230,0.75)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  }

  function drawOrb(orb) {
    const x = orb.x * width;
    const y = orb.y * height;
    const radius = Math.max(width, height) * orb.r;
    const grad = ctx.createRadialGradient(x, y, radius * 0.06, x, y, radius);
    grad.addColorStop(0, `rgba(${orb.c},0.34)`);
    grad.addColorStop(0.55, `rgba(${orb.c},0.18)`);
    grad.addColorStop(1, `rgba(${orb.c},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    drawBackdrop();

    orbs.forEach((orb, idx) => {
      const pull = (idx % 2 === 0 ? pointer.x : pointer.y) - 0.5;
      orb.x += orb.vx + pull * 0.00012;
      orb.y += orb.vy - pull * 0.0001;

      if (orb.x < -0.12 || orb.x > 1.12) orb.vx *= -1;
      if (orb.y < -0.12 || orb.y > 1.12) orb.vy *= -1;

      drawOrb(orb);
    });

    raf = window.requestAnimationFrame(animate);
  }

  function drawStatic() {
    drawBackdrop();
    orbs.forEach(drawOrb);
  }

  function onPointerMove(event) {
    pointer.x = event.clientX / Math.max(width, 1);
    pointer.y = event.clientY / Math.max(height, 1);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  if (prefersReducedMotion) {
    drawStatic();
  } else {
    animate();
  }

  window.addEventListener("beforeunload", () => {
    if (raf) window.cancelAnimationFrame(raf);
  });
}
function renderFooter() {
  const { ui } = state.content;
  const year = new Date().getFullYear();
  el.footerCopy.textContent = `${state.content.meta.name} · ${year}`;
  el.toTop.textContent = t(ui.backToTop);
}

function renderAll() {
  updateLangUI();
  renderNav();
  renderHero();
  renderAbout();
  renderSkills();
  renderEducation();
  renderProjects();
  configureContactForm();
  renderFooter();
}

function setupLanguageToggle() {
  el.langToggle.addEventListener("click", () => {
    state.lang = state.lang === "es" ? "en" : "es";
    renderAll();
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  });
}

async function loadContent() {
  const response = await fetch("./assets/data/content.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load content.json");
  }

  state.content = await response.json();
}

async function init() {
  try {
    initOrbBackground();
    await loadContent();
    renderAll();
    setupMenu();
    setupNavState();
    setupLanguageToggle();
    setupAnimations();
    el.contactForm.addEventListener("submit", handleSubmit);
  } catch (error) {
    console.error(error);
    document.body.innerHTML = "<main style='padding:2rem;font-family:sans-serif;'>Error loading portfolio content. Check assets/data/content.json.</main>";
  }
}

init();