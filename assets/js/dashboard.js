/* ==========================================================================
   Guild & Gable - Dashboard Control Center JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardNavigation();
  initDashboardCharts();
  initStatsCounters();
  initProfileForm();
  
  // Re-initialize charts on theme toggle click
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      // Use setTimeout to allow class list to update on body first
      setTimeout(() => {
        initDashboardCharts();
      }, 50);
    });
  }
});

/* ==========================================================================
   Single-Page Section Switcher Navigation
   ========================================================================== */
function initDashboardNavigation() {
  const sidebarLinks = document.querySelectorAll('.dashboard-sidebar-link');
  const sections = document.querySelectorAll('.dashboard-section');
  const sectionTitle = document.getElementById('dashboardSectionTitle');
  
  if (sidebarLinks.length === 0) return;
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetSectionId = link.getAttribute('data-section');
      const targetSection = document.getElementById(targetSectionId);
      
      if (!targetSection) return;
      
      // Update active state in sidebar
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Switch sections
      sections.forEach(s => s.classList.add('d-none'));
      targetSection.classList.remove('d-none');
      
      // Update header section title
      if (sectionTitle) {
        sectionTitle.textContent = link.querySelector('span').textContent;
      }
      
      // Close mobile offcanvas if it's active
      const offcanvasElement = document.getElementById('dashboardSidebarOffcanvas');
      if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
      
      // Re-trigger scroll reveal for elements in the current section
      const activeReveals = targetSection.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      activeReveals.forEach(el => el.classList.add('active'));
    });
  });
}

/* ==========================================================================
   Chart.js Configurations (Radar Performance & Line Sessions Charts)
   ========================================================================== */
let progressChartInstance = null;
let sessionsChartInstance = null;

function initDashboardCharts() {
  const isDark = document.body.classList.contains('dark-mode');
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(10, 92, 54, 0.08)';
  const labelColor = isDark ? '#FAF9F6' : '#1C2E24';
  
  // 1. Venue Selection Radar Chart
  const progressChartEl = document.getElementById('progressChart');
  if (progressChartEl && typeof Chart !== 'undefined') {
    if (progressChartInstance) {
      progressChartInstance.destroy();
    }
    
    progressChartInstance = new Chart(progressChartEl, {
      type: 'radar',
      data: {
        labels: ['Spatial Layout', 'Bespoke Carpentry', 'Drywall & Insulate', 'Smart Home Tech', 'Acoustic Comfort', 'Milestone Flow'],
        datasets: [{
          label: 'Your Design Profile',
          data: [78, 65, 92, 85, 70, 80],
          backgroundColor: 'rgba(82, 183, 136, 0.2)',
          borderColor: '#52B788',
          borderWidth: 2,
          pointBackgroundColor: '#52B788',
          pointBorderColor: isDark ? '#081C15' : '#0A5C36',
          pointHoverBackgroundColor: isDark ? '#081C15' : '#0A5C36',
          pointHoverBorderColor: '#52B788'
        }, {
          label: 'Architect Standard',
          data: [90, 85, 95, 90, 88, 92],
          backgroundColor: isDark ? 'rgba(184, 157, 108, 0.15)' : 'rgba(10, 92, 54, 0.15)',
          borderColor: isDark ? '#B89D6C' : '#0A5C36',
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointBackgroundColor: isDark ? '#B89D6C' : '#0A5C36',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: isDark ? '#B89D6C' : '#0A5C36'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: isDark ? '#FAF9F6' : '#1C2E24',
              font: {
                family: 'Outfit',
                size: 13
              }
            }
          }
        },
        scales: {
          r: {
            grid: {
              color: gridColor
            },
            angleLines: {
              color: gridColor
            },
            pointLabels: {
              color: labelColor,
              font: {
                family: 'Outfit',
                size: 12,
                weight: '500'
              }
            },
            ticks: {
              display: false,
              maxTicksLimit: 5
            },
            suggestedMin: 50,
            suggestedMax: 100
          }
        }
      }
    });
  }
  
  // 2. Monthly Progress & Budget Line Chart
  const sessionsChartEl = document.getElementById('sessionsChart');
  if (sessionsChartEl && typeof Chart !== 'undefined') {
    if (sessionsChartInstance) {
      sessionsChartInstance.destroy();
    }
    
    sessionsChartInstance = new Chart(sessionsChartEl, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Work Progress (%)',
          data: [10, 25, 40, 55, 60, 68],
          borderColor: '#52B788',
          backgroundColor: 'rgba(82, 183, 136, 0.05)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }, {
          label: 'Budget Utilization (%)',
          data: [15, 30, 42, 50, 58, 68],
          borderColor: isDark ? '#B89D6C' : '#0A5C36',
          backgroundColor: isDark ? 'rgba(184, 157, 108, 0.05)' : 'rgba(10, 92, 54, 0.05)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: isDark ? '#FAF9F6' : '#1C2E24',
              font: {
                family: 'Outfit'
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: isDark ? '#B89D6C' : '#0A5C36',
              font: { family: 'Outfit' }
            }
          },
          y: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: isDark ? '#B89D6C' : '#0A5C36',
              font: { family: 'Outfit' }
            }
          }
        }
      }
    });
  }
}

/* ==========================================================================
   Animated Numeric Counter Statistics
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.dashboard-stat-counter');
  if (counters.length === 0) return;
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1200; // 1.2 seconds
    const start = 0;
    const increment = target / (duration / 16); // ~60fps
    
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 16);
  });
}

/* ==========================================================================
   Dashboard Profile Settings Submission Updates
   ========================================================================== */
function initProfileForm() {
  const profileForm = document.getElementById('profileSettingsForm');
  if (!profileForm) return;
  
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    
    // Simulate API saving
    setTimeout(() => {
      // Create toast notice element
      const toastHtml = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
          <div class="toast show align-items-center text-white bg-primary border-0 rounded-4 glass-card p-2" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
              <div class="toast-body">
                <strong class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg> Profile updated successfully!</strong>
              </div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', toastHtml);
      
      // Auto remove toast
      const toast = document.querySelector('.toast-container');
      setTimeout(() => {
        if (toast) toast.remove();
      }, 3500);
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1200);
  });
}
