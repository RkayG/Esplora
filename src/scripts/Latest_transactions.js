// SCRIPT TO FETCH 10 LATEST TRANSACTIONS FROM SERVER AND DISPLAY ON INDEX PAGE
// THE API ON THE SERVER SIDE DEFAULTS TO 10 

// import internal scripts
import { calculateTimeDifference, shortenAddress, transactionType, convertWeiToEth } from './utility.js';
import { fetchLatestBlocks } from './Latest_blocks.js';

const transactionsList = document.getElementById('transactionTableBody');

let blockTimestamps = [];

// fetch data from Latest_blocks.js
async function fetchLatestTransactions() {
    try {
        const response = await fetch('http://localhost:3000/latest-blocks');
        const latestBlocksData = await response.json();

        // Extract transactions and timestamp from each block in latestBlocks
        const allTransactions = [];
        for (const block of latestBlocksData) {
            block.transactions.forEach((transaction) => {
                allTransactions.push({ transaction, timestamp: block.timestamp });
            })
        }

        return allTransactions;
    } catch (error) {
        console.error('Error fetching latest transactions:', error);
        return null;
    }
}

// parse and display fetched response
async function displayLatestTransactions(transactionsWithTimestamps) {
    if (!transactionsWithTimestamps) {
        console.error('Invalid transaction data');
        return;
    }

    let transactionCount = 1;

    for (const { transaction, timestamp } of transactionsWithTimestamps) {
        if (transactionCount == 10) {
            return;
        }
        //console.log(timestamp);
        const row = document.createElement('tr');

        const slicedHash = shortenAddress(transaction.hash);
        const slicedFrom = shortenAddress(transaction.from);
        const slicedTo = shortenAddress(transaction.to);

        const transactionMethod = transactionType(transaction.type);
        //console.log(transaction.type);
        const transactionValue = transaction.value.hex ? convertWeiToEth(transaction.value.hex) : 0; // Handle potential absence
                

            row.innerHTML = `
                <td class="px-4 py-3 text-xs text-center">${slicedHash}</td>
                <td class="text-xs text-center border-2 bg-blue-50">${transactionMethod}</td>
                <td class="px-6 py-3 text-xs text-center">${slicedFrom}</td>
                <td class="px-4 py-3 text-xs text-center">${slicedTo}</td>
                <td class="px-6 py-3 text-xs text-center">${transactionValue} eth</td>
                <td class="py-3 text-xs text-center">
                ${calculateTimeDifference(timestamp)} secs ago
             </td>
            `;

            transactionsList.appendChild(row);
            transactionCount += 1;
    }
}

window.addEventListener('load', async function() {
    const latestTransactions = await fetchLatestTransactions();
    displayLatestTransactions(latestTransactions);
});


 
