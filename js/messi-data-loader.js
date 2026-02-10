/**
 * Messi Data Loader — Single Source of Truth
 * Loads messi-stats.json and updates all DOM elements dynamically.
 * Also provides data access functions for the chatbot.
 */

(function () {
  'use strict';

  const DATA_PATH = getDataPath();
  let messiData = null;

  function getDataPath() {
    // Detect if we're in /pages/ subdirectory
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
      return '../js/messi-stats.json';
    }
    return 'js/messi-stats.json';
  }

  /** Fetch and cache data */
  async function loadData() {
    if (messiData) return messiData;
    try {
      const response = await fetch(DATA_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      messiData = await response.json();
      window.messiData = messiData; // expose globally for chatbot
      return messiData;
    } catch (err) {
      console.warn('⚠️ Could not load messi-stats.json:', err.message);
      return null;
    }
  }

  /** Animate a number from 0 to target */
  function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    const format = (n) => n.toLocaleString('es-AR');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      element.textContent = format(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /** Update stat elements by ID pattern */
  function updateTeamStats(data) {
    if (!data || !data.teams) return;

    const teamMap = {
      'barcelona': ['barca-matches', 'barca-goals', 'barca-assists', 'barca-titles'],
      'psg':       ['psg-matches', 'psg-goals', 'psg-assists', 'psg-titles'],
      'inter_miami': ['inter-matches', 'inter-goals', 'inter-assists', 'inter-titles'],
      'argentina': ['argentina-matches', 'argentina-goals', 'argentina-assists', 'argentina-titles']
    };

    const fields = ['matches', 'goals', 'assists', 'titles'];

    for (const [teamKey, ids] of Object.entries(teamMap)) {
      const team = data.teams[teamKey];
      if (!team) continue;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
          const value = team[fields[i]];
          if (isElementInViewport(el)) {
            animateCounter(el, value);
          } else {
            el.textContent = value.toLocaleString('es-AR');
            observeElement(el, value);
          }
        }
      });
    }

    // Career totals
    const careerMap = {
      'matches': data.career_totals.matches,
      'goals': data.career_totals.goals,
      'assists': data.career_totals.assists,
      'titles': data.career_totals.titles
    };

    for (const [id, value] of Object.entries(careerMap)) {
      const el = document.getElementById(id);
      if (el) {
        if (isElementInViewport(el)) {
          animateCounter(el, value);
        } else {
          el.textContent = value.toLocaleString('es-AR');
          observeElement(el, value);
        }
      }
    }
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= window.innerHeight;
  }

  function observeElement(el, value) {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(el, value);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
  }

  /** Update last-updated footer */
  function updateLastUpdated(data) {
    const el = document.getElementById('last-updated');
    if (el && data.last_updated) {
      el.innerHTML = `📊 Datos actualizados: ${data.last_updated} | Fuente: ${data.data_source}`;
    }
  }

  /** Initialize Chart.js chart for goals by year */
  function initGoalsChart(teamKey, data) {
    const canvas = document.getElementById('goals-chart');
    if (!canvas || !window.Chart) return;

    const team = data.teams[teamKey];
    if (!team || !team.goals_by_year) return;

    const years = Object.keys(team.goals_by_year);
    const goals = Object.values(team.goals_by_year);
    const teamColor = team.color || '#667eea';

    // Determine special bar colors for Argentina
    const backgroundColors = goals.map((g, i) => {
      if (teamKey === 'argentina') {
        const year = parseInt(years[i]);
        if (year === 2022) return '#ffd700'; // Mundial
        if (year === 2021 || year === 2024) return '#00bfa5'; // Copa América
      }
      return teamColor;
    });

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'Goles',
          data: goals,
          backgroundColor: backgroundColors,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 50
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { family: 'Inter', size: 14 },
            bodyFont: { family: 'Inter', size: 13 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `${context.parsed.y} goles`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              font: { family: 'Inter', weight: '600' },
              color: '#666'
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', weight: '600', size: years.length > 15 ? 9 : 12 },
              color: '#333',
              maxRotation: years.length > 10 ? 45 : 0,
              minRotation: years.length > 10 ? 45 : 0
            }
          }
        }
      }
    });
  }

  /** Scroll-triggered animations */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  /** Dark mode toggle */
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const saved = localStorage.getItem('messi-theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('messi-theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('messi-theme', 'dark');
      }
    });
  }

  /** Navbar hamburger toggle */
  function initNavbar() {
    const hamburger = document.getElementById('navbar-hamburger');
    const links = document.getElementById('navbar-links');
    if (!hamburger || !links) return;

    hamburger.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Close menu when clicking a link
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  /** Register Service Worker */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      const swPath = window.location.pathname.includes('/pages/') ? '../service-worker.js' : 'service-worker.js';
      navigator.serviceWorker.register(swPath).catch(() => {});
    }
  }

  /** Main init */
  async function init() {
    initNavbar();
    initThemeToggle();
    initScrollAnimations();
    registerServiceWorker();

    const data = await loadData();
    if (!data) return;

    updateTeamStats(data);
    updateLastUpdated(data);

    // Init chart if a team-specific chart container exists
    const chartEl = document.getElementById('goals-chart');
    if (chartEl) {
      const teamKey = chartEl.getAttribute('data-team');
      if (teamKey) initGoalsChart(teamKey, data);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
