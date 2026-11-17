/* Student Portal concept demo: all data is sample data held in memory. */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const DEMO = { studNo: "202310123", pass: "demo2026" };

  const GRADES = {
    "1-2526": { label: "1st Sem, A.Y. 2025–2026", rows: [
      ["ITEC 106", "Web Systems and Technologies", 3, 1.25],
      ["ITEC 105", "Network Fundamentals", 3, 1.50],
      ["DCIT 26", "Applications Development and Emerging Technologies", 3, 1.75],
      ["ITEC 80", "Human Computer Interaction", 3, 1.50],
      ["STAT 2", "Probability and Statistics", 3, 2.00],
      ["GNED 11", "Kontekstwalisadong Komunikasyon sa Filipino", 3, 1.50],
      ["FITT 3", "Physical Activities Towards Health and Fitness", 2, 1.25]
    ]},
    "2-2425": { label: "2nd Sem, A.Y. 2024–2025", rows: [
      ["DCIT 23", "Computer Programming II", 3, 1.50],
      ["DCIT 24", "Information Management", 3, 1.75],
      ["ITEC 50", "Integrative Programming and Technologies", 3, 1.75],
      ["GNED 04", "Mga Babasahin Hinggil sa Kasaysayan ng Pilipinas", 3, 1.50],
      ["GNED 06", "Science, Technology and Society", 3, 1.25],
      ["FITT 2", "Fitness Exercises", 2, 1.00]
    ]}
  };

  const SCHEDULE = [
    ["Monday", "7:00–10:00 AM", "ITEC 110", "Systems Integration and Architecture", "CL 3", "Instr. A. Reyes"],
    ["Monday", "1:00–3:00 PM", "ITEC 111", "Information Assurance and Security", "Rm 401", "Instr. M. Santos"],
    ["Tuesday", "8:00–11:00 AM", "ITEC 112", "Advanced Database Systems", "CL 2", "Instr. J. Garcia"],
    ["Wednesday", "7:00–10:00 AM", "ITEC 110", "Systems Integration and Architecture", "CL 3", "Instr. A. Reyes"],
    ["Wednesday", "1:00–3:00 PM", "ITEC 111", "Information Assurance and Security", "Rm 401", "Instr. M. Santos"],
    ["Thursday", "9:00 AM–12:00 PM", "ITEC 116", "IT Capstone Project 1", "Rm 302", "Instr. L. Cruz"],
    ["Friday", "10:00 AM–1:00 PM", "ITEC 113", "Social and Professional Issues", "Rm 205", "Instr. R. Bautista"]
  ];

  const PRE = [
    ["ITEC 200", "IT Capstone Project 2", 3],
    ["ITEC 201", "Systems Administration and Maintenance", 3],
    ["ITEC 202", "Cloud Computing Fundamentals", 3],
    ["ITEC 203", "Mobile Application Development", 3],
    ["ITEC 204", "IT Elective: Network Security", 3],
    ["ITEC 205", "IT Elective: Data Analytics", 3],
    ["GNED 14", "Panitikang Panlipunan", 3],
    ["ITEC 199", "Practicum (OJT) Orientation", 1]
  ];

  const NEWS = [
    ["Registrar", "Pre-enrollment for 1st Sem, A.Y. 2026–2027 is open", "Submit your subject requests through the portal. Requests are reviewed by your adviser and the registrar.", "Nov 14, 2026"],
    ["Academic", "Midterm grades are now viewable", "Check the Grades page. Contact your instructor for any discrepancy within five school days.", "Nov 12, 2026"],
    ["Campus", "IT Week 2026: call for student booths", "Student organizations may reserve a booth slot at the student affairs office.", "Nov 10, 2026"],
    ["Academic", "Capstone title defense schedule posted", "See your section adviser for room assignments and required documents.", "Nov 5, 2026"],
    ["Registrar", "Requests for certificate of grades", "Printed certificates may be requested at the registrar's window, Mon–Fri, 8 AM–4 PM.", "Oct 28, 2026"]
  ];

  /* ---------- helpers ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable: keep in memory */ } }
  };
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
  }
  const fmt = n => n.toFixed(2);
  function gwa(rows) {
    const units = rows.reduce((s, r) => s + r[2], 0);
    const w = rows.reduce((s, r) => s + r[2] * r[3], 0);
    return { units, value: w / units };
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- login (Log In includes Verify Credentials) ---------- */
  const loginForm = $("#loginForm");
  function verifyCredentials(no, pw) { return no.trim() === DEMO.studNo && pw === DEMO.pass; }

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const no = $("#studNo").value, pw = $("#pass").value, err = $("#loginError");
    if (!no || !pw) { err.textContent = "Please enter your student number and password."; return; }
    if (!verifyCredentials(no, pw)) { err.textContent = "Incorrect student number or password. Try the demo account below."; return; }
    err.textContent = "";
    openApp();
  });
  $("#fillDemo").addEventListener("click", () => {
    $("#studNo").value = DEMO.studNo;
    $("#pass").value = DEMO.pass;
    $("#loginError").textContent = "";
    $("#studNo").focus();
  });
  // Reset Password extends Log In
  $("#forgot").addEventListener("click", () =>
    toast("Demo: a password reset link would be sent to the student's registered email."));

  function openApp() {
    $("#login").hidden = true;
    $("#app").hidden = false;
    renderAll();
    show("dashboard");
    window.scrollTo(0, 0);
  }
  $("#logout").addEventListener("click", () => {
    $("#app").hidden = true;
    $("#login").hidden = false;
    loginForm.reset();
    toast("You have been logged out.");
  });

  /* ---------- navigation ---------- */
  const TITLES = {
    dashboard: "Good day, Juan!", grades: "Grades", schedule: "Class schedule",
    enrollment: "Enrollment", announcements: "Announcements", profile: "Profile"
  };
  function show(view) {
    $$(".sidebar nav button[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === view));
    $$(".view").forEach(v => { v.hidden = v.dataset.view !== view; });
    $("#viewTitle").textContent = TITLES[view];
    $("#crumb").textContent = view === "dashboard" ? "Dashboard" : "Portal · " + TITLES[view];
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  }
  $$(".sidebar nav button[data-view]").forEach(b => b.addEventListener("click", () => show(b.dataset.view)));

  /* ---------- renderers ---------- */
  function renderGrades() {
    const key = $("#semSelect").value, sem = GRADES[key];
    $("#gradeBody").innerHTML = sem.rows.map(r =>
      `<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${fmt(r[3])}</td><td class="pass">${r[3] <= 3 ? "Passed" : "Failed"}</td></tr>`).join("");
    const g = gwa(sem.rows);
    $("#unitTotal").textContent = g.units;
    $("#gwa").textContent = fmt(g.value);
    $("#cogSem").textContent = sem.label;
  }
  $("#semSelect").addEventListener("change", renderGrades);
  // Print Certificate of Grades extends View Grades
  $("#printCog").addEventListener("click", () => window.print());

  function renderSchedule() {
    $("#schedBody").innerHTML = SCHEDULE.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let today = days[new Date().getDay()];
    let items = SCHEDULE.filter(r => r[0] === today);
    if (!items.length) { today = "Monday"; items = SCHEDULE.filter(r => r[0] === today); }
    $("#todayList").innerHTML = items.map(r =>
      `<li><span class="time">${r[1]}</span><span><strong>${r[2]} · ${esc(r[3])}</strong><small>${r[4]} · ${r[5]}${today !== days[new Date().getDay()] ? " · next class day: " + today : ""}</small></span></li>`).join("");
  }

  function renderNews(filter = "all") {
    const list = NEWS.filter(n => filter === "all" || n[0] === filter);
    $("#newsList").innerHTML = list.map(n =>
      `<li><span class="tag">${n[0]}</span><strong>${esc(n[1])}</strong><p>${esc(n[2])}</p><time>${n[3]}</time></li>`).join("");
    $("#miniNews").innerHTML = NEWS.slice(0, 3).map(n =>
      `<li><span class="time">${n[3].replace(", 2026", "")}</span><span><strong>${esc(n[1])}</strong><small>${n[0]}</small></span></li>`).join("");
  }
  $$(".chip").forEach(c => c.addEventListener("click", () => {
    $$(".chip").forEach(x => x.classList.toggle("active", x === c));
    renderNews(c.dataset.filter);
  }));

  function renderEnrollment() {
    const pre = store.get("portalDemoPre");
    const steps = [
      ["Enrolled · 2nd Sem, A.Y. 2025–2026", "Official enrollment confirmed by the registrar", "done"],
      ["Pre-enrollment · 1st Sem, A.Y. 2026–2027", pre ? `Submitted ${pre.codes.length} subjects (${pre.units} units)` : "Open: choose your subjects", pre ? "done" : "current"],
      ["Adviser and registrar approval", pre ? "Waiting for review" : "After you submit", pre ? "current" : ""],
      ["Officially enrolled", "Certificate of registration released", ""]
    ];
    $("#timeline").innerHTML = steps.map(s => `<li class="${s[2]}"><strong>${s[0]}</strong><small>${s[1]}</small></li>`).join("");
    $("#preList").innerHTML = PRE.map(p =>
      `<li><label><input type="checkbox" value="${p[0]}" data-units="${p[2]}" ${pre && pre.codes.includes(p[0]) ? "checked" : ""}><span><strong>${p[0]}</strong> ${esc(p[1])}</span><small>${p[2]} unit${p[2] > 1 ? "s" : ""}</small></label></li>`).join("");
    updateUnits();
    $("#statEnroll").textContent = pre ? "For approval" : "Enrolled";
    $("#statEnrollSub").textContent = pre ? "Pre-enrollment, 1st Sem 2026–2027" : "2nd Sem, A.Y. 2025–2026";
  }
  function updateUnits() {
    const u = $$("#preList input:checked").reduce((s, i) => s + Number(i.dataset.units), 0);
    $("#preUnits").textContent = u;
    $("#preUnits").style.color = u > 24 ? "#a3341f" : "";
    return u;
  }
  $("#preList").addEventListener("change", updateUnits);
  $("#preForm").addEventListener("submit", e => {
    e.preventDefault();
    const codes = $$("#preList input:checked").map(i => i.value), units = updateUnits(), err = $("#preError");
    if (!codes.length) { err.textContent = "Select at least one subject."; return; }
    if (units > 24) { err.textContent = "You can request up to 24 units only."; return; }
    err.textContent = "";
    store.set("portalDemoPre", { codes, units });
    renderEnrollment();
    toast("Pre-enrollment submitted for approval.");
  });

  $("#profileForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
    toast("Profile updated (demo only, not saved to a server).");
  });

  function renderAll() {
    renderGrades();
    renderSchedule();
    renderNews();
    renderEnrollment();
    $("#statGwa").textContent = fmt(gwa(GRADES["1-2526"].rows).value);
  }

  // Deep link support, e.g. demo/index.html?demo=1#grades opens straight into the app
  if (new URLSearchParams(location.search).has("demo")) {
    const v = location.hash.slice(1);
    openApp();
    if (TITLES[v]) show(v);
  }
})();
