import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OrbBackground from "./components/OrbBackground";
import GradientText from "./components/reactbits/GradientText";
import MagneticButton from "./components/reactbits/MagneticButton";
import SpotlightCard from "./components/reactbits/SpotlightCard";
import content from "./data/content.json";

gsap.registerPlugin(ScrollTrigger);

const LANG_KEY = "portfolio_lang";

function t(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.es || "";
}

function normalizeUrl(value) {
  if (!value) return "#";
  if (/^(mailto:|tel:|https?:\/\/)/i.test(value)) return value;
  return `https://${value}`;
}

function navText(lang) {
  return lang === "es"
    ? {
        home: "Home",
        about: "Sobre mi",
        skills: "Skills",
        education: "Estudios",
        projects: "Proyectos",
        contact: "Contacto"
      }
    : {
        home: "Home",
        about: "About",
        skills: "Skills",
        education: "Education",
        projects: "Projects",
        contact: "Contact"
      };
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "es");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const labels = useMemo(() => navText(lang), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.title = `${content.meta.name} | ${content.meta.role}`;
  }, [lang]);

  useEffect(() => {
    const sections = [...document.querySelectorAll("main section[id]")];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.35, 0.5, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    gsap.from([".eyebrow", "#heroName", "#heroRole", "#heroTagline", ".hero-actions", ".social-list", ".reactbits-pill"], {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.08
    });

    gsap.utils.toArray(".reveal").forEach((section) => {
      gsap.to(section, {
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

    gsap.utils.toArray([".card", ".project-card", ".timeline-item", ".spotlight-card"]).forEach((item) => {
      gsap.from(item, {
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

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [lang]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = `${formData.get("name") || ""}`.trim();
    const email = `${formData.get("email") || ""}`.trim();
    const message = `${formData.get("message") || ""}`.trim();

    if (!name || !email || !message) {
      setFeedback({ message: t(content.ui.formErrorRequired, lang), type: "error" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback({ message: t(content.ui.formErrorEmail, lang), type: "error" });
      return;
    }

    setFeedback({ message: t(content.ui.formSending, lang), type: "" });

    try {
      if (content.contact.provider === "emailjs") {
        const cfg = content.contact.emailjs;
        if (!cfg?.serviceId || !cfg?.templateId || !cfg?.publicKey) {
          throw new Error("EmailJS config missing");
        }

        const payload = {
          service_id: cfg.serviceId,
          template_id: cfg.templateId,
          user_id: cfg.publicKey,
          template_params: { name, email, message }
        };

        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("EmailJS request failed");
      } else {
        const response = await fetch(content.contact.formspree.endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData
        });

        if (!response.ok) throw new Error("Formspree request failed");
      }

      form.reset();
      setFeedback({ message: t(content.ui.formSuccess, lang), type: "success" });
    } catch {
      setFeedback({ message: t(content.ui.formErrorSend, lang), type: "error" });
    }
  };

  return (
    <>
      <OrbBackground />
      <a className="skip-link" href="#home">Skip to content</a>

      <header className="site-header" id="top">
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label="Ir a inicio">
            <span className="brand-dot" aria-hidden="true" />
            <span>{content.meta.name}</span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="siteNav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="menu-line" />
            <span className="menu-line" />
            <span className="menu-line" />
            <span className="visually-hidden">Toggle navigation</span>
          </button>

          <nav id="siteNav" className={`site-nav ${mobileOpen ? "open" : ""}`} aria-label="Main navigation">
            {Object.entries(labels).map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                data-nav={id}
                className={activeSection === id ? "active" : ""}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            className="lang-toggle"
            type="button"
            aria-label="Cambiar idioma"
            onClick={() => setLang((v) => (v === "es" ? "en" : "es"))}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="container hero-grid">
            <p className="eyebrow">{content.meta.location}</p>
            <span className="reactbits-pill">ReactBits style UI</span>
            <h1 id="heroName"><GradientText>{content.meta.name}</GradientText></h1>
            <p id="heroRole" className="hero-role">{content.meta.role}</p>
            <p id="heroTagline" className="hero-tagline">{t(content.meta.tagline, lang)}</p>
            <div className="hero-actions">
              <MagneticButton className="btn btn-primary" href="#projects">{t(content.ui.ctaProjects, lang)}</MagneticButton>
              <MagneticButton className="btn btn-ghost" href="#contact">{t(content.ui.ctaContact, lang)}</MagneticButton>
            </div>
            <ul className="social-list" aria-label="Social links">
              {content.meta.socials.map((social) => (
                <li key={social.label}>
                  <a className="social-link" href={normalizeUrl(social.url)} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section reveal" id="about">
          <div className="container section-grid">
            <div>
              <p className="section-kicker">{t(content.ui.aboutKicker, lang)}</p>
              <h2>{t(content.ui.aboutTitle, lang)}</h2>
            </div>
            <SpotlightCard>
              <p className="lead">{t(content.about.text, lang)}</p>
            </SpotlightCard>
          </div>
        </section>

        <section className="section reveal" id="skills">
          <div className="container">
            <div className="section-head">
              <p className="section-kicker">{t(content.ui.skillsKicker, lang)}</p>
              <h2>{t(content.ui.skillsTitle, lang)}</h2>
            </div>
            <div className="cards-grid">
              {content.skills.map((group) => (
                <article className="card" key={t(group.category, lang)}>
                  <h3>{t(group.category, lang)}</h3>
                  <div className="chip-list">
                    {group.items.map((item) => (
                      <span className="chip" key={`${item.name}-${item.level || "na"}`}>
                        {item.level ? `${item.name} - ${item.level}` : item.name}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section reveal" id="education">
          <div className="container">
            <div className="section-head">
              <p className="section-kicker">{t(content.ui.educationKicker, lang)}</p>
              <h2>{t(content.ui.educationTitle, lang)}</h2>
            </div>
            <div className="timeline">
              {content.education.map((entry) => (
                <article className="timeline-item" key={`${entry.title}-${entry.date}`}>
                  <div className="timeline-top">
                    <h3>{entry.title}</h3>
                    <span className="timeline-date">{entry.date}</span>
                  </div>
                  <p className="lead">{entry.institution}</p>
                  <p>{t(entry.description, lang)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section reveal" id="projects">
          <div className="container">
            <div className="section-head">
              <p className="section-kicker">{t(content.ui.projectsKicker, lang)}</p>
              <h2>{t(content.ui.projectsTitle, lang)}</h2>
            </div>
            <div className="projects-grid">
              {content.projects.map((project) => (
                <article className={`project-card ${project.featured ? "featured" : ""}`} key={project.title}>
                  <h3>{project.title}</h3>
                  <p className="lead">{t(project.description, lang)}</p>
                  <div className="chip-list">
                    {project.stack.map((tech) => (
                      <span className="chip" key={tech}>{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.demoUrl ? (
                      <a className="project-link" href={normalizeUrl(project.demoUrl)} target="_blank" rel="noreferrer">
                        {t(content.ui.projectDemo, lang)}
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a className="project-link" href={normalizeUrl(project.repoUrl)} target="_blank" rel="noreferrer">
                        {t(content.ui.projectRepo, lang)}
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section reveal" id="contact">
          <div className="container contact-grid">
            <div>
              <p className="section-kicker">{t(content.ui.contactKicker, lang)}</p>
              <h2>{t(content.ui.contactTitle, lang)}</h2>
              <p className="lead">{t(content.ui.contactLead, lang)}</p>
              <div className="contact-meta">
                <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
                {content.contact.phone ? <a href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}>{content.contact.phone}</a> : null}
                <p>{content.contact.location}</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="nameInput">{t(content.ui.formName, lang)}</label>
              <input id="nameInput" name="name" type="text" required autoComplete="name" placeholder={t(content.ui.formNamePlaceholder, lang)} />

              <label htmlFor="emailInput">{t(content.ui.formEmail, lang)}</label>
              <input id="emailInput" name="email" type="email" required autoComplete="email" placeholder={t(content.ui.formEmailPlaceholder, lang)} />

              <label htmlFor="messageInput">{t(content.ui.formMessage, lang)}</label>
              <textarea id="messageInput" name="message" rows="6" required placeholder={t(content.ui.formMessagePlaceholder, lang)} />

              <button className="btn btn-primary" type="submit">{t(content.ui.formSubmit, lang)}</button>
              <p className={`form-feedback ${feedback.type === "error" ? "is-error" : ""} ${feedback.type === "success" ? "is-success" : ""}`} role="status" aria-live="polite">
                {feedback.message}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>{content.meta.name} - {new Date().getFullYear()}</p>
          <a href="#top" className="to-top">{t(content.ui.backToTop, lang)}</a>
        </div>
      </footer>
    </>
  );
}