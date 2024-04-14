// SCRIPT TO FETCH ETH PRICE AND MARKETCAP FROM SERVER AND DISPLAY ON INDEX PAGE

//fetch server response
async function fetchEthInfo() {
    try {
        const response = await fetch('http://localhost:3000/ethInfo');
        const { ethPrice, ethMarketcap } = await response.json();

        // Format marketcap with commas
        const formattedMarketcap = ethMarketcap.toLocaleString();

        document.getElementById('ethPrice').innerHTML = `${ethPrice} USD`;
        document.getElementById('ethMarketcap').innerHTML = `${formattedMarketcap} USD`;
    } catch (error) {
        console.error('Error fetching eth price:', error);
    }
}

fetchEthInfo();