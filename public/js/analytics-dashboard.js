// Analytics Dashboard Script
// Handles chart rendering and analytics data

class AnalyticsDashboard {
  constructor() {
    this.charts = {};
    this.initializeCharts();
  }
  
  initializeCharts() {
    this.createUserGrowthChart();
    this.createCourseProgressChart();
    this.createEngagementChart();
  }
  
  createUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart');
    if (ctx) {
      this.charts.userGrowth = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Users',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'User Growth Over Time'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  createCourseProgressChart() {
    const ctx = document.getElementById('courseProgressChart');
    if (ctx) {
      this.charts.courseProgress = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Not Started'],
          datasets: [{
            data: [30, 45, 25],
            backgroundColor: [
              '#10b981',
              '#f59e0b',
              '#ef4444'
            ],
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Course Progress Distribution'
            }
          }
        }
      });
    }
  }
  
  createEngagementChart() {
    const ctx = document.getElementById('engagementChart');
    if (ctx) {
      this.charts.engagement = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Active Users',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: '#3b82f6',
            borderColor: '#1e3a8a',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Weekly Engagement'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  updateChart(chartName, data) {
    if (this.charts[chartName]) {
      this.charts[chartName].data = data;
      this.charts[chartName].update();
    }
  }
}

// Initialize dashboard when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.analyticsDashboard = new AnalyticsDashboard();
  });
} else {
  window.analyticsDashboard = new AnalyticsDashboard();
}

export { AnalyticsDashboard };
