
const ctx = document.getElementById('dashboardChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['01일', '02일', '03일', '04일'],
    datasets: [{
      label: '유동 인구 수',
      data: [120, 190, 300, 150],
      backgroundColor: '#0074D9'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
