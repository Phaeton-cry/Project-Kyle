/* Portfolio interactions: nav, scroll spy, reveal, lightbox, contact form */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const CONTACT_EMAIL = "nudasmakylesalazar@gmail.com"; // change here and in index.html if needed

  /* ---------- Mobile navigation ---------- */
  const toggle = $(".nav-toggle");
  const setNav = open => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open")));
  $$(".main-nav a").forEach(a => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setNav(false); });

  /* ---------- Header shadow + back-to-top ---------- */
  const header = $(".site-header"), toTop = $("#to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Scroll spy (highlights current section in the nav) ---------- */
  const links = $$(".main-nav a");
  const sections = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));

    /* ---------- Reveal on scroll ---------- */
    const rev = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(el => rev.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));
  }

  /* ---------- Lightbox (certificates + diagram) ---------- */
  const box = $("#lightbox"), boxImg = $("img", box), boxCap = $("p", box);
  let lastTrigger = null;
  $$(".js-lightbox").forEach(btn => btn.addEventListener("click", () => {
    lastTrigger = btn;
    boxImg.src = btn.dataset.src;
    boxImg.alt = btn.dataset.caption || "";
    boxCap.textContent = btn.dataset.caption || "";
    if (typeof box.showModal === "function") box.showModal();
    else window.open(btn.dataset.src, "_blank", "noopener");
  }));
  const closeBox = () => { box.close(); if (lastTrigger) lastTrigger.focus(); };
  $(".lightbox-close").addEventListener("click", closeBox);
  box.addEventListener("click", e => { if (e.target === box) closeBox(); });

  /* ---------- Contact form: sends straight to Gmail via FormSubmit ----------
     FormSubmit (formsubmit.co) forwards each message to CONTACT_EMAIL.
     The very first message triggers an activation email: open it in Gmail and click
     "Activate Form" once. After that, every message lands in the inbox directly. */
  const form = $("#contact-form"), status = $("#form-status");
  const submitBtn = $("button[type=submit]", form);
  const ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
  const messages = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    message: "Please write a message of at least 10 characters."
  };
  const check = input => {
    const field = input.closest(".field"), err = $(".error", field);
    const ok = input.checkValidity() && input.value.trim() !== "";
    field.classList.toggle("invalid", !ok);
    if (err) err.textContent = ok ? "" : messages[input.name];
    return ok;
  };
  const setStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle("err", isError);
  };
  $$("input:not(.hp), textarea", form).forEach(i => i.addEventListener("blur", () => check(i)));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const inputs = $$("input[required], textarea[required]", form);
    const valid = inputs.map(check).every(Boolean);
    if (!valid) { setStatus(""); inputs.find(i => !i.checkValidity() || !i.value.trim()).focus(); return; }

    const d = Object.fromEntries(new FormData(form));
    if (d._honey) return; // spam bot filled the hidden field

    submitBtn.disabled = true;
    setStatus("Sending your message…");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: d.name,
          email: d.email,
          topic: d.topic,
          message: d.message,
          _subject: `[Portfolio] ${d.topic} from ${d.name}`,
          _replyto: d.email,
          _template: "table",
          _captcha: "false"
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === "false") throw new Error(data.message || "Request failed");
      setStatus(`Thank you, ${d.name.split(" ")[0]}! Your message was sent. I'll reply to ${d.email} soon.`);
      form.reset();
    } catch (err) {
      setStatus(`Sorry, the message couldn't be sent right now. Please email me directly at ${CONTACT_EMAIL}.`, true);
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
