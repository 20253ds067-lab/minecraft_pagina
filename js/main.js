/* ============================================
   SERVIDOR DE IXAYA - MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Active nav link detection ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbarNav .nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Navbar scroll effect ---
  var navbar = document.getElementById('main-navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll animations with IntersectionObserver ---
  var animElements = document.querySelectorAll('.animate-on-scroll');
  if (animElements.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Health bar animation ---
  var healthBars = document.querySelectorAll('.health-bar[data-width]');
  if (healthBars.length > 0) {
    var healthObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          bar.style.width = bar.getAttribute('data-width') + '%';
          healthObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    healthBars.forEach(function (bar) {
      healthObserver.observe(bar);
    });
  }

  // --- Copy IP to clipboard ---
  document.querySelectorAll('.ip-display').forEach(function (el) {
    el.addEventListener('click', function () {
      var ipValue = this.querySelector('.ip-value');
      if (ipValue) {
        var ip = ipValue.textContent.trim();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(ip).then(function () {
            showToast('IP copiada al portapapeles');
          }).catch(function () {
            fallbackCopy(ip);
          });
        } else {
          fallbackCopy(ip);
        }
      }
    });
  });

  // --- Initialize Bootstrap tooltips ---
  var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  if (tooltipTriggerList.length > 0 && typeof bootstrap !== 'undefined') {
    tooltipTriggerList.forEach(function (el) {
      new bootstrap.Tooltip(el);
    });
  }

  // --- Close mobile nav on link click ---
  var navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 992) {
          var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }

});

// --- Toast notification ---
function showToast(message) {
  var toast = document.querySelector('.copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 2200);
}

// --- Fallback copy for older browsers ---
function fallbackCopy(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('IP copiada al portapapeles');
  } catch (e) {
    showToast('No se pudo copiar');
  }
  document.body.removeChild(textArea);
}
