/* ============================================================
   TECH ZENTRA — script.js
   Multi-page application script
   Sections:
   1. Utilities & motion detection
   2. Page detection
   3. Smooth scrolling (Lenis)
   4. Navigation (multi-page + mobile)
   5. Cursor effects
   6. Hero animation (GSAP) — home page only
   7. Tech Galaxy — home page only
   8. Particle background
   9. Technology selector (orbit) — home page only
   10. Program cards — home + programs pages
   11. Terminal animation — home page only
   12. Zentra Loop — home page only
   13. Projects — programs page only
   14. Career roadmap — career page only
   15. Statistics counters — home + about pages
   16. Why Tech Zentra — about page only
   17. Instructors — about page only
   18. Testimonials carousel — about page only
   19. AI Course finder — career page only
   20. FAQ — contact page only
   21. Contact validation — contact page only
   22. Scroll reveal
   23. CTA canvas
   24. Magnetic buttons
   ============================================================ */

(function () {
  "use strict";

  // ---- 1. Utilities & motion detection ----
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ---- 2. Page detection ----
  const path = window.location.pathname.split("/").pop() || "index.html";
  const pageMap = {
    "index.html": "home",
    "programs.html": "programs",
    "career.html": "career",
    "about.html": "about",
    "contact.html": "contact",
  };
  const currentPage = pageMap[path] || "home";

  // ---- 3. Smooth scrolling (Lenis) ----
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ---- 4. Navigation ----
  const navbar = $("#navbar");
  const menuToggle = $("#menu-toggle");
  const mobileMenu = $("#mobile-menu");

  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Set active nav link
  $$(".nav-link").forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("active");
      link.style.color = "var(--text)";
    }
  });

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Handle in-page anchor links (same-page smooth scroll)
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("href");
      if (target && target.length > 1) {
        const el = $(target);
        if (el) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(el, { offset: -80 });
          } else {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          closeMobileMenu();
        }
      }
    });
  });

  // ---- 5. Cursor effects ----
  if (!prefersReducedMotion && !isMobile) {
    const glow = $("#cursor-glow");
    if (glow) {
      let mx = window.innerWidth / 2,
        my = window.innerHeight / 2;
      let cx = mx,
        cy = my;

      window.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
      });

      function animateGlow() {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        glow.style.left = cx + "px";
        glow.style.top = cy + "px";
        requestAnimationFrame(animateGlow);
      }
      animateGlow();
    }
  }

  // ---- 6. Hero animation (GSAP) — home page only ----
  if (currentPage === "home") {
    if (typeof gsap !== "undefined" && !prefersReducedMotion) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".brand-logo", { opacity: 0, y: -20, duration: 0.5 })
        .from("#hero-badge", { opacity: 0, y: 20, duration: 0.6 }, "-=0.2")
        .to(".reveal-word", { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, "-=0.2")
        .from(".hero-desc", { opacity: 0, y: 20, duration: 0.5 }, "-=0.2")
        .from(".hero-buttons > *", { opacity: 0, y: 20, duration: 0.4, stagger: 0.1 }, "-=0.2")
        .from("#tech-galaxy", { opacity: 0, scale: 0.6, duration: 0.8 }, "-=0.6");
    } else {
      $$(".reveal-word").forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
    }
  }

  // ---- 7. Tech Galaxy — home page only ----
  if (currentPage === "home") {
    const galaxyNodes = [
      "AWS", "Python", "Java", "DevOps", "Docker",
      "Kubernetes", "AI", "Data Science", "Cyber Security",
    ];
    const galaxy = $("#tech-galaxy");
    const galaxyLines = $("#galaxy-lines");

    function buildGalaxy() {
      if (!galaxy) return;
      const size = galaxy.offsetWidth;
      const cx = size / 2,
        cy = size / 2;
      const radius = size * 0.38;
      const nodeEls = [];

      galaxyNodes.forEach((label, i) => {
        const angle = (i / galaxyNodes.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        const el = document.createElement("div");
        el.className = "galaxy-node";
        el.textContent = label;
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.transform = "translate(-50%, -50%)";
        galaxy.appendChild(el);
        nodeEls.push({ el, x, y });
      });

      if (galaxyLines) {
        galaxyLines.setAttribute("viewBox", `0 0 ${size} ${size}`);
        nodeEls.forEach(({ x, y }) => {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", cx);
          line.setAttribute("y1", cy);
          line.setAttribute("x2", x);
          line.setAttribute("y2", y);
          galaxyLines.appendChild(line);
        });
      }

      if (!prefersReducedMotion) {
        let t = 0;
        function orbit() {
          t += 0.002;
          nodeEls.forEach(({ el }, i) => {
            const baseAngle = (i / galaxyNodes.length) * Math.PI * 2 - Math.PI / 2;
            const angle = baseAngle + t;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            el.style.left = x + "px";
            el.style.top = y + "px";
          });
          const lines = galaxyLines.querySelectorAll("line");
          lines.forEach((line, i) => {
            const baseAngle = (i / galaxyNodes.length) * Math.PI * 2 - Math.PI / 2;
            const angle = baseAngle + t;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            line.setAttribute("x2", x);
            line.setAttribute("y2", y);
          });
          requestAnimationFrame(orbit);
        }
        orbit();
      }

      if (!prefersReducedMotion && !isMobile) {
        galaxy.addEventListener("mousemove", (e) => {
          const rect = galaxy.getBoundingClientRect();
          const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
          const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
          galaxy.style.transform = `translate(${dx * 15}px, ${dy * 15}px)`;
        });
        galaxy.addEventListener("mouseleave", () => {
          galaxy.style.transform = "translate(0, 0)";
        });
      }
    }
    buildGalaxy();
  }

  // ---- 8. Particle background ----
  const particleCanvas = $("#particle-canvas");
  if (particleCanvas && !prefersReducedMotion && !isMobile) {
    const ctx = particleCanvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const count = Math.min(60, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(108, 99, 255, 0.4)";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108, 99, 255, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ---- 9. Technology selector (orbit) — home page only ----
  if (currentPage === "home") {
    const techData = {
      aws: { title: "AWS & CLOUD COMPUTING", icon: "☁", name: "AWS", desc: "Master cloud infrastructure, deployment, and architecture on AWS.", skills: ["EC2", "S3", "IAM", "VPC", "Lambda", "CloudFormation", "Docker", "Kubernetes"] },
      devops: { title: "DEVOPS ENGINEERING", icon: "⚙", name: "DevOps", desc: "Automate deployments, CI/CD pipelines, and infrastructure as code.", skills: ["Jenkins", "Docker", "Kubernetes", "Terraform", "Ansible", "Git", "AWS", "Prometheus"] },
      python: { title: "FULL STACK PYTHON", icon: "🐍", name: "Python", desc: "Build web applications end-to-end with Python, Django, and React.", skills: ["Python", "Django", "Flask", "REST APIs", "PostgreSQL", "React", "Docker", "Celery"] },
      java: { title: "FULL STACK JAVA", icon: "☕", name: "Java", desc: "Enterprise-grade development with Java, Spring Boot, and microservices.", skills: ["Java", "Spring Boot", "Hibernate", "Maven", "REST APIs", "MySQL", "Docker", "Kubernetes"] },
      data: { title: "DATA SCIENCE", icon: "📊", name: "Data Science", desc: "Analyze data, build models, and extract actionable insights.", skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL", "Tableau", "Matplotlib", "TensorFlow"] },
      security: { title: "CYBER SECURITY", icon: "🛡", name: "Cyber Security", desc: "Protect systems, detect threats, and secure cloud infrastructure.", skills: ["Network Security", "Penetration Testing", "SIEM", "Linux", "Cryptography", "OWASP", "Wireshark", "Burp Suite"] },
      ai: { title: "AI / MACHINE LEARNING", icon: "🤖", name: "AI", desc: "Build intelligent systems with machine learning and deep learning.", skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "MLOps", "LLMs", "Pandas"] },
    };

    const orbitContainer = $("#orbit-container");
    const orbitKeys = ["aws", "devops", "python", "java", "data", "security", "ai"];
    let activeTech = "aws";

    function buildOrbit() {
      if (!orbitContainer) return;
      const size = orbitContainer.offsetWidth;
      const cx = size / 2,
        cy = size / 2;
      const radius = size * 0.4;

      [0.45, 0.7, 0.95].forEach((r) => {
        const ring = document.createElement("div");
        ring.className = "orbit-ring";
        ring.style.width = size * r + "px";
        ring.style.height = size * r + "px";
        orbitContainer.appendChild(ring);
      });

      orbitKeys.forEach((key, i) => {
        const angle = (i / orbitKeys.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        const el = document.createElement("button");
        el.className = "orbit-node";
        el.textContent = techData[key].title.split(" ")[0];
        el.dataset.tech = key;
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.addEventListener("click", () => selectTech(key));
        orbitContainer.appendChild(el);
      });

      selectTech(activeTech);
    }

    function selectTech(key) {
      activeTech = key;
      const data = techData[key];
      if (!data) return;

      $$(".orbit-node").forEach((n) => n.classList.toggle("active", n.dataset.tech === key));

      const panel = $("#tech-panel");
      panel.style.opacity = "0";
      panel.style.transform = "translateY(10px)";

      setTimeout(() => {
        $("#tp-icon").textContent = data.icon;
        $("#tp-title").textContent = data.title;
        $("#tp-desc").textContent = data.desc;
        $("#tp-name").textContent = data.name;
        const skillsEl = $("#tp-skills");
        skillsEl.innerHTML = "";
        data.skills.forEach((s) => {
          const tag = document.createElement("span");
          tag.className = "skill-tag";
          tag.textContent = s;
          skillsEl.appendChild(tag);
        });
        panel.style.opacity = "1";
        panel.style.transform = "translateY(0)";
      }, 200);
    }
    buildOrbit();
  }

  // ---- 10. Program cards — home + programs pages ----
  if (currentPage === "home" || currentPage === "programs") {
    const programs = [
      { icon: "☁", name: "AWS & Cloud Computing", tags: ["Cloud Infrastructure", "AWS", "Networking", "Security", "DevOps"], modules: 12, projects: 4, difficulty: "intermediate", desc: "Master cloud architecture and deployment on AWS." },
      { icon: "⚙", name: "DevOps Engineering", tags: ["CI/CD", "Docker", "Kubernetes", "Terraform", "Monitoring"], modules: 10, projects: 5, difficulty: "advanced", desc: "Automate infrastructure and deployment pipelines." },
      { icon: "🐍", name: "Full Stack Python", tags: ["Python", "Django", "REST APIs", "PostgreSQL", "React"], modules: 14, projects: 6, difficulty: "beginner", desc: "Build complete web applications with Python." },
      { icon: "☕", name: "Full Stack Java", tags: ["Java", "Spring Boot", "Microservices", "Maven", "MySQL"], modules: 14, projects: 5, difficulty: "intermediate", desc: "Enterprise development with Java and Spring." },
      { icon: "📊", name: "Data Science", tags: ["Python", "Pandas", "ML", "SQL", "Visualization"], modules: 12, projects: 4, difficulty: "intermediate", desc: "Analyze data and build predictive models." },
      { icon: "🛡", name: "Cyber Security", tags: ["Network Security", "Pentesting", "SIEM", "OWASP", "Linux"], modules: 11, projects: 4, difficulty: "advanced", desc: "Protect systems and secure infrastructure." },
      { icon: "🤖", name: "AI / Machine Learning", tags: ["TensorFlow", "PyTorch", "NLP", "Computer Vision", "MLOps"], modules: 13, projects: 5, difficulty: "advanced", desc: "Build intelligent systems with ML and DL." },
      { icon: "💻", name: "Software Development", tags: ["Data Structures", "Algorithms", "System Design", "Git", "Testing"], modules: 15, projects: 6, difficulty: "beginner", desc: "Core software engineering fundamentals." },
    ];

    function buildPrograms() {
      const grid = $("#programs-grid");
      if (!grid) return;
      programs.forEach((p) => {
        const card = document.createElement("article");
        card.className = "program-card reveal-up tilt-card";
        const diffClass = `difficulty-${p.difficulty}`;
        card.innerHTML = `
          <div class="program-icon">${p.icon}</div>
          <h3 class="mt-4 font-display text-lg font-700 text-ink-primary">${p.name}</h3>
          <p class="mt-2 text-sm text-ink-secondary">${p.desc}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            ${p.tags.map((t) => `<span class="program-tag">${t}</span>`).join("")}
          </div>
          <div class="program-meta mt-4">
            <span>${p.modules} Modules</span>
            <span>${p.projects} Projects</span>
            <span class="difficulty-badge ${diffClass}">${p.difficulty}</span>
          </div>
          <a href="/contact.html" class="program-link mt-4 inline-block">Explore Program <span>→</span></a>
        `;
        grid.appendChild(card);
      });
    }
    buildPrograms();
  }

  // ---- 11. Terminal animation — home page only ----
  if (currentPage === "home") {
    const terminalCommands = [
      { cmd: "$ git clone techzentra-project", out: "Cloning into 'techzentra-project'...", type: "info" },
      { cmd: "$ npm install", out: "added 342 packages in 12s", type: "info" },
      { cmd: "$ docker build -t techzentra-app .", out: "✓ Build successful", type: "out" },
      { cmd: "$ docker push techzentra-app", out: "✓ Docker image created", type: "out" },
      { cmd: "$ kubectl apply -f deployment.yaml", out: "✓ Deployment successful", type: "out" },
      { cmd: "$ kubectl get pods", out: "✓ Application running", type: "out" },
      { cmd: "$ status", out: "● LIVE", type: "out" },
    ];

    function typeTerminal() {
      const output = $("#terminal-output");
      if (!output) return;
      output.innerHTML = "";
      let cmdIndex = 0;

      function nextCommand() {
        if (cmdIndex >= terminalCommands.length) {
          setTimeout(() => {
            output.innerHTML = "";
            cmdIndex = 0;
            nextCommand();
          }, 4000);
          return;
        }
        const item = terminalCommands[cmdIndex];
        const cmdLine = document.createElement("div");
        cmdLine.className = "term-cmd";
        output.appendChild(cmdLine);

        typeText(cmdLine, item.cmd, () => {
          if (item.out) {
            const outLine = document.createElement("div");
            outLine.className = item.type === "out" ? "term-out" : "term-info";
            output.appendChild(outLine);
            typeText(outLine, item.out, () => {
              cmdIndex++;
              setTimeout(nextCommand, 600);
            }, 15);
          } else {
            cmdIndex++;
            setTimeout(nextCommand, 400);
          }
        }, 30);
      }
      nextCommand();
    }

    function typeText(el, text, done, speed) {
      let i = 0;
      function step() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(step, speed);
        } else {
          el.textContent = text;
          done();
        }
      }
      step();
    }

    let terminalStarted = false;
    const terminalBody = $("#terminal-body");
    if (terminalBody && !prefersReducedMotion) {
      const termObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !terminalStarted) {
              terminalStarted = true;
              typeTerminal();
            }
          });
        },
        { threshold: 0.3 }
      );
      termObserver.observe(terminalBody);
    } else if (terminalBody) {
      const output = $("#terminal-output");
      if (output) {
        output.innerHTML = terminalCommands
          .map((c) => `<div class="term-cmd">${c.cmd}</div><div class="${c.type === "out" ? "term-out" : "term-info"}">${c.out}</div>`)
          .join("");
      }
    }
  }

  // ---- 12. Zentra Loop — home page only ----
  if (currentPage === "home") {
    const loopSteps = [
      { num: "01", icon: "📚", title: "LEARN", desc: "Master core concepts with structured curriculum." },
      { num: "02", icon: "✏", title: "PRACTICE", desc: "Apply knowledge through hands-on exercises." },
      { num: "03", icon: "🔨", title: "BUILD", desc: "Create real-world projects and applications." },
      { num: "04", icon: "🚀", title: "DEPLOY", desc: "Ship to production with CI/CD pipelines." },
      { num: "05", icon: "🔍", title: "REVIEW", desc: "Get feedback and refine your work." },
      { num: "06", icon: "🏆", title: "MASTER", desc: "Achieve expertise and advance your career." },
    ];

    function buildLoop() {
      const grid = $("#loop-grid");
      if (!grid) return;
      loopSteps.forEach((step) => {
        const el = document.createElement("div");
        el.className = "loop-step reveal-up";
        el.innerHTML = `
          <div class="loop-num">${step.num}</div>
          <div class="loop-icon">${step.icon}</div>
          <h3 class="font-display text-base font-700 text-ink-primary">${step.title}</h3>
          <p class="mt-2 text-sm text-ink-secondary">${step.desc}</p>
        `;
        grid.appendChild(el);
      });
    }
    buildLoop();
  }

  // ---- 13. Projects — programs page only ----
  if (currentPage === "programs") {
    const projects = [
      { icon: "☁", name: "Cloud Infrastructure Platform", stack: ["AWS", "Terraform", "Docker", "Kubernetes", "Python"], desc: "Scalable multi-region cloud infrastructure with automated provisioning and monitoring." },
      { icon: "🛒", name: "Full Stack E-Commerce Platform", stack: ["Python", "Django", "React", "PostgreSQL", "Redis"], desc: "Complete e-commerce solution with payments, inventory, and admin dashboard." },
      { icon: "🔄", name: "DevOps CI/CD Pipeline", stack: ["Jenkins", "Docker", "Kubernetes", "Ansible", "AWS"], desc: "End-to-end automation pipeline from code commit to production deployment." },
      { icon: "📊", name: "Data Science Analytics Dashboard", stack: ["Python", "Pandas", "Plotly", "FastAPI", "React"], desc: "Real-time analytics platform with interactive visualizations and reporting." },
      { icon: "🛡", name: "Cyber Security Monitoring Platform", stack: ["SIEM", "Python", "Elasticsearch", "Kibana", "Linux"], desc: "Security operations center with threat detection and incident response." },
      { icon: "🤖", name: "AI-powered Application", stack: ["TensorFlow", "Python", "FastAPI", "React", "Docker"], desc: "Intelligent assistant with NLP, recommendation engine, and ML models." },
    ];

    function buildProjects() {
      const scroll = $("#projects-scroll");
      if (!scroll) return;
      projects.forEach((p) => {
        const card = document.createElement("article");
        card.className = "project-card reveal-up";
        card.innerHTML = `
          <div class="project-visual">${p.icon}</div>
          <div class="project-body">
            <h3 class="font-display text-lg font-700 text-ink-primary">${p.name}</h3>
            <div class="mt-3 flex flex-wrap gap-2">
              ${p.stack.map((s) => `<span class="program-tag">${s}</span>`).join("")}
            </div>
            <div class="project-desc">
              <p class="text-sm text-ink-secondary">${p.desc}</p>
              <a href="/contact.html" class="program-link mt-3 inline-block">View Project <span>→</span></a>
            </div>
          </div>
        `;
        scroll.appendChild(card);
      });
    }
    buildProjects();
  }

  // ---- 14. Career roadmap — career page only ----
  if (currentPage === "career") {
    const careerRoadmaps = {
      "Cloud Engineer": ["Linux", "Networking", "AWS", "Docker", "Kubernetes", "Terraform", "Cloud Engineer"],
      "DevOps Engineer": ["Linux", "Git", "Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "DevOps Engineer"],
      "Python Developer": ["Python", "Django", "REST APIs", "PostgreSQL", "Docker", "Celery", "Python Developer"],
      "Java Developer": ["Java", "Spring Boot", "Hibernate", "Microservices", "Maven", "MySQL", "Java Developer"],
      "Data Scientist": ["Python", "Statistics", "Pandas", "Scikit-learn", "SQL", "Deep Learning", "Data Scientist"],
      "Cyber Security Engineer": ["Linux", "Networking", "Pentesting", "OWASP", "SIEM", "Cryptography", "Cyber Security Engineer"],
    };

    function buildCareerButtons() {
      const container = $("#career-buttons");
      if (!container) return;
      Object.keys(careerRoadmaps).forEach((role, i) => {
        const btn = document.createElement("button");
        btn.className = "career-btn" + (i === 0 ? " active" : "");
        btn.textContent = role;
        btn.dataset.role = role;
        btn.addEventListener("click", () => selectCareer(role));
        container.appendChild(btn);
      });
    }

    function selectCareer(role) {
      $$(".career-btn").forEach((b) => b.classList.toggle("active", b.dataset.role === role));
      $("#roadmap-title").textContent = role.toUpperCase();
      const stepsEl = $("#roadmap-steps");
      stepsEl.innerHTML = "";
      const steps = careerRoadmaps[role];
      steps.forEach((step, i) => {
        const isFinal = i === steps.length - 1;
        const stepEl = document.createElement("div");
        stepEl.className = "roadmap-step" + (isFinal ? " final" : "");
        stepEl.innerHTML = `<span class="step-num">${i + 1}</span> ${step}`;
        stepsEl.appendChild(stepEl);
        if (!isFinal) {
          const connector = document.createElement("div");
          connector.className = "roadmap-connector";
          stepsEl.appendChild(connector);
        }
      });

      if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        gsap.fromTo(stepsEl.children, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 });
      }
    }
    buildCareerButtons();
    selectCareer("Cloud Engineer");
  }

  // ---- 15. Statistics counters — home + about pages ----
  if (currentPage === "home" || currentPage === "about") {
    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(update);
    }

    const statNumbers = $$(".stat-number");
    if (statNumbers.length) {
      const statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      statNumbers.forEach((el) => statObserver.observe(el));
    }
  }

  // ---- 16. Why Tech Zentra — about page only ----
  if (currentPage === "about") {
    const features = [
      { icon: "🎓", title: "Industry Curriculum", desc: "Courses designed with real-world industry requirements and standards." },
      { icon: "🔨", title: "Hands-on Projects", desc: "Build production-ready applications throughout your learning journey." },
      { icon: "👨‍🏫", title: "Expert Mentors", desc: "Learn from professionals who build and deploy at scale." },
      { icon: "🧭", title: "Career Guidance", desc: "Personalized roadmaps and interview prep to land your dream role." },
      { icon: "☁", title: "Cloud Labs", desc: "Practice in real cloud environments with dedicated lab access." },
      { icon: "🤖", title: "AI-Powered Learning", desc: "Adaptive learning paths powered by AI recommendations." },
    ];

    function buildWhy() {
      const grid = $("#why-grid");
      if (!grid) return;
      features.forEach((f) => {
        const el = document.createElement("div");
        el.className = "feature-block reveal-up";
        el.innerHTML = `
          <div class="feature-icon">${f.icon}</div>
          <h3 class="font-display text-lg font-700 text-ink-primary">${f.title}</h3>
          <p class="mt-2 text-sm text-ink-secondary">${f.desc}</p>
        `;
        grid.appendChild(el);
      });
    }
    buildWhy();
  }

  // ---- 17. Instructors — about page only ----
  if (currentPage === "about") {
    const instructors = [
      { initials: "RA", name: "Rahul Sharma", role: "Cloud Architect", exp: "12+ years", skills: ["AWS", "Docker", "Kubernetes", "Terraform"] },
      { initials: "PK", name: "Priya Kapoor", role: "DevOps Lead", exp: "10+ years", skills: ["Jenkins", "Kubernetes", "Ansible", "AWS"] },
      { initials: "AV", name: "Arun Verma", role: "Senior Data Scientist", exp: "8+ years", skills: ["Python", "TensorFlow", "NLP", "SQL"] },
      { initials: "SN", name: "Sneha Nair", role: "Security Engineer", exp: "9+ years", skills: ["Pentesting", "OWASP", "SIEM", "Linux"] },
    ];

    function buildInstructors() {
      const grid = $("#instructor-grid");
      if (!grid) return;
      instructors.forEach((ins) => {
        const el = document.createElement("div");
        el.className = "instructor-card reveal-up";
        el.innerHTML = `
          <div class="instructor-avatar">${ins.initials}</div>
          <h3 class="font-display text-base font-700 text-ink-primary">${ins.name}</h3>
          <p class="text-sm text-accent-secondary font-500">${ins.role}</p>
          <p class="mt-1 text-xs text-ink-secondary">${ins.exp}</p>
          <div class="mt-3 flex flex-wrap justify-center gap-2">
            ${ins.skills.map((s) => `<span class="program-tag">${s}</span>`).join("")}
          </div>
          <a href="#" class="instructor-link">LinkedIn ↗</a>
        `;
        grid.appendChild(el);
      });
    }
    buildInstructors();
  }

  // ---- 18. Testimonials carousel — about page only ----
  if (currentPage === "about") {
    const testimonials = [
      { initials: "AK", name: "Amit Kumar", role: "Cloud Engineer @ TechCorp", course: "AWS & Cloud Computing", text: "Tech Zentra transformed my career. The hands-on projects and cloud labs gave me real confidence. I landed a Cloud Engineer role within 3 months of completing the program." },
      { initials: "RG", name: "Riya Gupta", role: "DevOps Engineer @ FinTech", course: "DevOps Engineering", text: "The DevOps program was incredibly practical. I built actual CI/CD pipelines and deployed real applications. The mentors are industry experts who genuinely care about your growth." },
      { initials: "VS", name: "Vikram Singh", role: "Python Developer @ Startup", course: "Full Stack Python", text: "From zero to full stack developer in months. The curriculum is well-structured and the projects mirror real-world scenarios. Best tech learning experience I've had." },
      { initials: "MD", name: "Meera Desai", role: "Data Scientist @ Analytics Co", course: "Data Science", text: "The Data Science program covered everything from statistics to deep learning. The AI-powered learning path kept me engaged and the career guidance helped me crack interviews." },
    ];

    let currentTestimonial = 0;

    function buildTestimonials() {
      const track = $("#testimonial-track");
      const dots = $("#testimonial-dots");
      if (!track) return;
      testimonials.forEach((t, i) => {
        const card = document.createElement("div");
        card.className = "testimonial-card";
        card.innerHTML = `
          <div class="testimonial-inner">
            <div class="flex items-center gap-4">
              <div class="testimonial-play" aria-label="Play testimonial">▶</div>
              <div>
                <div class="testimonial-avatar">${t.initials}</div>
              </div>
              <div>
                <h3 class="font-display text-base font-700 text-ink-primary">${t.name}</h3>
                <p class="text-sm text-accent-secondary">${t.role}</p>
              </div>
            </div>
            <p class="mt-4 text-sm text-ink-secondary leading-relaxed">"${t.text}"</p>
            <p class="mt-4 text-xs text-ink-secondary">Course: <span class="text-ink-primary font-500">${t.course}</span></p>
          </div>
        `;
        track.appendChild(card);

        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
        dot.addEventListener("click", () => goToTestimonial(i));
        dots.appendChild(dot);
      });
    }

    function goToTestimonial(index) {
      currentTestimonial = index;
      const track = $("#testimonial-track");
      track.style.transform = `translateX(-${index * 100}%)`;
      $$(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === index));
    }

    buildTestimonials();

    const prevBtn = $("#prev-testimonial");
    const nextBtn = $("#next-testimonial");
    if (prevBtn) prevBtn.addEventListener("click", () => goToTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length));
    if (nextBtn) nextBtn.addEventListener("click", () => goToTestimonial((currentTestimonial + 1) % testimonials.length));

    if (!prefersReducedMotion) {
      setInterval(() => {
        goToTestimonial((currentTestimonial + 1) % testimonials.length);
      }, 6000);
    }
  }

  // ---- 19. AI Course finder — career page only ----
  if (currentPage === "career") {
    const finderPaths = {
      "Cloud Engineer": ["Linux", "Networking", "AWS", "Docker", "Kubernetes", "Terraform", "Cloud Engineer"],
      "DevOps Engineer": ["Linux", "Git", "Docker", "Kubernetes", "Jenkins", "Terraform", "DevOps Engineer"],
      "Full Stack Developer": ["HTML/CSS", "JavaScript", "React", "Python/Java", "Databases", "Docker", "Full Stack Developer"],
      "Data Scientist": ["Python", "Statistics", "Pandas", "ML", "Deep Learning", "SQL", "Data Scientist"],
      "Cyber Security Engineer": ["Linux", "Networking", "Pentesting", "OWASP", "SIEM", "Cryptography", "Cyber Security Engineer"],
    };

    function buildFinder() {
      const container = $("#finder-options");
      if (!container) return;
      Object.keys(finderPaths).forEach((goal, i) => {
        const btn = document.createElement("button");
        btn.className = "finder-option" + (i === 0 ? " active" : "");
        btn.textContent = `I want to become a ${goal}`;
        btn.dataset.goal = goal;
        btn.addEventListener("click", () => selectFinder(goal));
        container.appendChild(btn);
      });
    }

    function selectFinder(goal) {
      $$(".finder-option").forEach((b) => b.classList.toggle("active", b.dataset.goal === goal));
      $("#finder-title").textContent = goal;
      const pathEl = $("#finder-path");
      pathEl.innerHTML = "";
      const steps = finderPaths[goal];
      steps.forEach((step, i) => {
        const isFinal = i === steps.length - 1;
        const stepEl = document.createElement("div");
        stepEl.className = "roadmap-step" + (isFinal ? " final" : "");
        stepEl.innerHTML = `<span class="step-num">${i + 1}</span> ${step}`;
        pathEl.appendChild(stepEl);
        if (!isFinal) {
          const connector = document.createElement("div");
          connector.className = "roadmap-connector";
          pathEl.appendChild(connector);
        }
      });

      if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        gsap.fromTo(pathEl.children, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 });
      }
    }
    buildFinder();
    selectFinder("Cloud Engineer");
  }

  // ---- 20. FAQ — contact page only ----
  if (currentPage === "contact") {
    const faqs = [
      { q: "Do I need programming experience?", a: "Our learning paths include beginner-friendly options — no prior programming experience is required to get started." },
      { q: "Do you provide projects?", a: "Programs are designed around hands-on practical projects. You'll build real-world applications and cloud infrastructure." },
      { q: "Which program should I choose?", a: "Use our career roadmap and AI course finder to discover the path that matches your goals and experience level." },
      { q: "Are the instructors industry professionals?", a: "Yes. All mentors are working professionals with 8+ years of experience building and deploying at scale." },
      { q: "Do you offer career support?", a: "We provide personalized career guidance, interview preparation, and resume reviews to help you land your target role." },
      { q: "How long are the programs?", a: "Programs range from 10 to 15 modules, typically completed over 3 to 6 months depending on your pace." },
    ];

    function buildFAQ() {
      const list = $("#faq-list");
      if (!list) return;
      faqs.forEach((faq, i) => {
        const item = document.createElement("div");
        item.className = "faq-item";
        item.innerHTML = `
          <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-${i}">
            <span class="faq-prompt">&gt;</span>
            <span>${faq.q}</span>
            <span class="faq-arrow">▸</span>
          </button>
          <div class="faq-answer" id="faq-ans-${i}">
            <span class="faq-answer-prefix">&gt; </span>${faq.a}
          </div>
        `;
        const btn = item.querySelector(".faq-question");
        btn.addEventListener("click", () => {
          const isOpen = item.classList.toggle("open");
          btn.setAttribute("aria-expanded", String(isOpen));
        });
        list.appendChild(item);
      });
    }
    buildFAQ();
  }

  // ---- 21. Contact validation — contact page only ----
  if (currentPage === "contact") {
    const contactForm = $("#contact-form");
    const contactSubmit = $("#contact-submit");
    const formStatus = $("#form-status");

    function showError(fieldId, msg) {
      const field = $(`#cf-${fieldId}`);
      const err = $(`#err-${fieldId}`);
      if (field) field.classList.add("error");
      if (err) err.textContent = msg;
    }

    function clearError(fieldId) {
      const field = $(`#cf-${fieldId}`);
      const err = $(`#err-${fieldId}`);
      if (field) field.classList.remove("error");
      if (err) err.textContent = "";
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
      if (!phone) return true;
      return /^[+]?[\d\s\-()]{7,}$/.test(phone);
    }

    if (contactForm) {
      ["name", "email", "phone", "program", "experience", "message"].forEach((f) => {
        const el = $(`#cf-${f}`);
        if (el) el.addEventListener("input", () => clearError(f));
      });

      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        ["name", "email", "phone", "program", "experience", "message"].forEach(clearError);
        formStatus.textContent = "";
        formStatus.className = "form-status";

        const name = $("#cf-name").value.trim();
        const email = $("#cf-email").value.trim();
        const phone = $("#cf-phone").value.trim();
        const program = $("#cf-program").value;
        const experience = $("#cf-experience").value;
        const message = $("#cf-message").value.trim();

        if (!name) { showError("name", "Please enter your name."); valid = false; }
        if (!email) { showError("email", "Please enter your email."); valid = false; }
        else if (!validateEmail(email)) { showError("email", "Please enter a valid email address."); valid = false; }
        if (phone && !validatePhone(phone)) { showError("phone", "Please enter a valid phone number."); valid = false; }
        if (!program) { showError("program", "Please select a program."); valid = false; }
        if (!experience) { showError("experience", "Please select your experience level."); valid = false; }
        if (!message) { showError("message", "Please enter a message."); valid = false; }

        if (!valid) {
          formStatus.textContent = "Please fix the errors above.";
          formStatus.classList.add("error");
          return;
        }

        contactSubmit.classList.add("loading");
        formStatus.textContent = "Sending your enquiry...";

        // ============================================================
        // PLACEHOLDER: submitContactForm()
        // Replace this simulated submission with your actual backend
        // API call (e.g., Supabase, custom endpoint, email service).
        // Example:
        //   await fetch('/api/contact', { method: 'POST', body: ... })
        // ============================================================
        submitContactForm({ name, email, phone, program, experience, message })
          .then(() => {
            contactSubmit.classList.remove("loading");
            formStatus.textContent = "✓ Thank you! We'll get back to you within 24 hours.";
            formStatus.classList.add("success");
            contactForm.reset();
          })
          .catch(() => {
            contactSubmit.classList.remove("loading");
            formStatus.textContent = "Something went wrong. Please try again.";
            formStatus.classList.add("error");
          });
      });
    }

    // Placeholder function — integrate your backend/API here
    function submitContactForm(data) {
      return new Promise((resolve) => {
        console.log("Contact form data (ready for backend integration):", data);
        setTimeout(resolve, 1500);
      });
    }
  }

  // ---- 22. Scroll reveal ----
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    $$(".reveal-up").forEach((el) => revealObserver.observe(el));

    // Zentra loop step activation (home page)
    const loopSteps = $$(".loop-step");
    const loopObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            loopObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    loopSteps.forEach((el) => loopObserver.observe(el));
  } else {
    $$(".reveal-up").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // ---- 23. CTA canvas ----
  const ctaCanvas = $("#cta-canvas");
  if (ctaCanvas && !prefersReducedMotion) {
    const ctx = ctaCanvas.getContext("2d");
    let ctaParticles = [];

    function resizeCTA() {
      const rect = ctaCanvas.parentElement.getBoundingClientRect();
      ctaCanvas.width = rect.width;
      ctaCanvas.height = rect.height;
    }
    resizeCTA();
    window.addEventListener("resize", resizeCTA);

    for (let i = 0; i < 40; i++) {
      ctaParticles.push({
        x: Math.random() * ctaCanvas.width,
        y: Math.random() * ctaCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    function drawCTA() {
      ctx.clearRect(0, 0, ctaCanvas.width, ctaCanvas.height);
      ctaParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > ctaCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > ctaCanvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 217, 255, 0.3)";
        ctx.fill();
      });
      for (let i = 0; i < ctaParticles.length; i++) {
        for (let j = i + 1; j < ctaParticles.length; j++) {
          const dx = ctaParticles[i].x - ctaParticles[j].x;
          const dy = ctaParticles[i].y - ctaParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(ctaParticles[i].x, ctaParticles[i].y);
            ctx.lineTo(ctaParticles[j].x, ctaParticles[j].y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawCTA);
    }
    drawCTA();
  }

  // ---- 24. Magnetic buttons ----
  if (!prefersReducedMotion && !isMobile) {
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });

    // Card tilt effect
    $$(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
})();
