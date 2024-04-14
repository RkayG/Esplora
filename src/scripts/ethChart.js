// SCRIPT TO FETCH ETHEREUM PRICE CHART AND DISPLAY ON INDEX PAGE

const chartEl = document.getElementById('ethChart');
const ctx = chartEl.getContext('2d');
let chart;

const buttons = document.querySelectorAll('button');

let timeframe = '24hours'; // Default timeframe

const fetchData = async (timeframe) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${timeframe}`);
  const data = await response.json();
  console.log(data);
  //console.log(data.timestamps);
  const timestamps = data.prices.map(price => new Date(price[0])); // Extract timestamps from prices array ([timestamp, price] format)
 console.log(timestamps[0].toLocaleString());
  return { prices: data.prices.map(price => price[1]), timestamps };
};

const renderChart = async (timeframe) => {
  const data = await fetchData(timeframe);

   // Destroy existing chart before creating a new one
   if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.timestamps.map(timestamp => timestamp.toLocaleDateString()),
      datasets: [{
        label: 'ETH Price (USD)',
        data: data.prices,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
        tension: 0.9, // Adjust for curve
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false,
          scaleLabel: {
            display: false,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Price (USD)'
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    },
  });
    
  //chart.data.labels = data.timestamps.map(timestamp => timestamp.toLocaleDateString());
 // chart.data.datasets[0].data = data.prices;
  chart.update(); // Update chart data instead of creating a new one
};

buttons.forEach(button => {
  button.addEventListener('click', () => {
    timeframe = button.id;
    buttons.forEach(b => b.classList.remove('btn-primary'));
    button.classList.add('btn-primary');
    renderChart(timeframe);
  });
});

renderChart(timeframe); // Render initial chart
