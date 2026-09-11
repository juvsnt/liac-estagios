(function () {
  "use strict";

  /* ===== Theme toggle ===== */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var STORAGE_KEY = "liac-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) applyTheme(saved);
  } catch (e) {}

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  /* ===== Mobile / full menu overlay ===== */
  var menuToggle = document.getElementById("menuToggle");
  var menuOverlay = document.getElementById("menuOverlay");

  function closeMenu() {
    menuOverlay.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuOverlay.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    menuOverlay.addEventListener("click", function (e) {
      if (e.target === menuOverlay || e.target.tagName === "A") closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ===== Progress bar ===== */
  var progressBar = document.getElementById("progressBar");
  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }

  /* ===== Back to top ===== */
  var backToTop = document.getElementById("backToTop");
  function updateBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) backToTop.classList.add("is-visible");
    else backToTop.classList.remove("is-visible");
  }
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", function () {
    updateProgress();
    updateBackToTop();
  }, { passive: true });
  updateProgress();
  updateBackToTop();

  /* ===== Scrollspy for top nav ===== */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var spySections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (spySections.length && "IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    spySections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ===== Reveal on scroll ===== */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ===== Tabs (Estágio I/II, Exemplos ensino-estágio) ===== */
  var tabGroups = document.querySelectorAll(".tabs");
  tabGroups.forEach(function (group) {
    var buttons = group.querySelectorAll(".tab-btn");
    var panels = group.querySelectorAll(".tab-panel");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-tab");
        buttons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
        });
      });
    });
  });

  /* ===== Trilhas: render, search, filter ===== */
  var TRILHAS = [
    { code: "LIAC-01", title: "Hardware, Diagnóstico e Manutenção Computacional", cat: "infra", catLabel: "Infraestrutura & Hardware" },
    { code: "LIAC-02", title: "Administração de Sistemas Linux", cat: "infra", catLabel: "Infraestrutura & Hardware" },
    { code: "LIAC-03", title: "Redes e Infraestrutura Computacional", cat: "infra", catLabel: "Infraestrutura & Hardware" },
    { code: "LIAC-04", title: "Computação Paralela e Sistemas Distribuídos", cat: "infra", catLabel: "Infraestrutura & Hardware" },
    { code: "LIAC-05", title: "Sistemas Embarcados, IoT e Raspberry Pi", cat: "infra", catLabel: "Infraestrutura & Hardware" },
    { code: "LIAC-06", title: "Desenvolvimento Web", cat: "dev", catLabel: "Desenvolvimento" },
    { code: "LIAC-07", title: "Engenharia e Desenvolvimento de Software", cat: "dev", catLabel: "Desenvolvimento" },
    { code: "LIAC-08", title: "Banco de Dados, APIs e Integração", cat: "dev", catLabel: "Desenvolvimento" },
    { code: "LIAC-09", title: "Inteligência Artificial, Processamento de Imagens e Visão Computacional", cat: "ia", catLabel: "IA & Dados" },
    { code: "LIAC-10", title: "Automação, Scripts e Ferramentas Computacionais", cat: "ops", catLabel: "Automação & DevOps" },
    { code: "LIAC-11", title: "IHC, Usabilidade, Testes e Qualidade de Software", cat: "qualidade", catLabel: "Qualidade & Pessoas" },
    { code: "LIAC-12", title: "DevOps, Git, Implantação e Serviços", cat: "ops", catLabel: "Automação & DevOps" },
    { code: "LIAC-13", title: "Documentação Técnica e Gestão do Conhecimento", cat: "qualidade", catLabel: "Qualidade & Pessoas" },
    { code: "LIAC-14", title: "Tecnologias Educacionais para Computação", cat: "qualidade", catLabel: "Qualidade & Pessoas" },
    { code: "LIAC-15", title: "Soluções Computacionais e Extensão Tecnológica", cat: "extensao", catLabel: "Extensão" }
  ];

  var trilhasGrid = document.getElementById("trilhasGrid");
  var trilhasEmpty = document.getElementById("trilhasEmpty");
  var trilhaSearch = document.getElementById("trilhaSearch");
  var filterChips = document.getElementById("filterChips");
  var activeFilter = "all";

  function renderTrilhas() {
    if (!trilhasGrid) return;
    var term = (trilhaSearch && trilhaSearch.value || "").trim().toLowerCase();

    var filtered = TRILHAS.filter(function (t) {
      var matchesFilter = activeFilter === "all" || t.cat === activeFilter;
      var matchesTerm =
        !term ||
        t.code.toLowerCase().indexOf(term) !== -1 ||
        t.title.toLowerCase().indexOf(term) !== -1;
      return matchesFilter && matchesTerm;
    });

    trilhasGrid.innerHTML = filtered
      .map(function (t) {
        return (
          '<article class="trilha-card" style="--cat-color:var(--cat-' + t.cat + ')">' +
            '<span class="trilha-code">' + t.code + "</span>" +
            "<h3>" + t.title + "</h3>" +
            '<span class="trilha-cat">' + t.catLabel + "</span>" +
          "</article>"
        );
      })
      .join("");

    if (trilhasEmpty) trilhasEmpty.hidden = filtered.length !== 0;
  }

  if (trilhaSearch) {
    trilhaSearch.addEventListener("input", renderTrilhas);
  }
  if (filterChips) {
    filterChips.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      filterChips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      activeFilter = chip.getAttribute("data-filter");
      renderTrilhas();
    });
  }

  renderTrilhas();
})();
