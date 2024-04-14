// SCRIPT TO FETCH TOTAL_NUMBER_OF_BLOCKS AND AVERAGE_BLOCK_TIME ON ETHEREUM FROM SERVER

//fetch server response
async function fetchBlockInfo() {
    try {
        const totalBlockResponse = await fetch('http://localhost:3000/totalBlocks');
        const averageTimeResponse = await fetch('http://localhost:3000/averageBlockTime');

        const { totalBlocks } = await totalBlockResponse.json();
        const { averageBlockTimeSeconds } = await averageTimeResponse.json();

        // Format totalBlocks with commas
        const formattedTotalBlocks = totalBlocks.toLocaleString();

        document.getElementById('totalBlock').innerHTML = formattedTotalBlocks;
        document.getElementById('averageBlockTime').innerHTML = `${averageBlockTimeSeconds}s`
    } catch (error) {
        console.error('Error fetching total blocks:', error);
    }
}

async function fetchTotalTransactionCount() {
    try {
        const response = await fetch('http://localhost:3000/totalTransactionCount');
        const { totalTransactionCount } = await response.json();

        const formattedTransactionCount = totalTransactionCount.toLocaleString();
        console.log(formattedTransactionCount);

        document.getElementById('totalTransactions').innerHTML = `${formattedTransactionCount}M`;
    } catch (error) {
        console.error('Error fetching total transactions count', error);
    }
}

fetchBlockInfo();
fetchTotalTransactionCount();