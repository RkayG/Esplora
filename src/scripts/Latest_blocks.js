// SCRIPT TO FETCH 10 LATEST BLOCKS FROM SERVER AND DISPLAY ON INDEX PAGE
// THE API ON THE SERVER SIDE DEFAULTS TO 10 

// import utility function
import { calculateTimeDifference } from './utility.js';

const blocksList = document.getElementById('blockTableBody');

// Fetch latest blocks from the server and store them in latestBlocks
export async function fetchLatestBlocks() {
    try {
        const response = await fetch('http://localhost:3000/latest-blocks');
        const latestBlocks = await response.json();
        
        // console.log(latestBlocks);
        return latestBlocks;
    } catch (error) {
        console.error('Error fetching latest blocks:', error);
        return null;
    }
}

// parse and display fetched response
async function displayLatestBlocks(latestBlocksData) {
    if (!latestBlocksData) {
        console.error('Invalid block data');
        return;
    }

    for (const key in latestBlocksData) {
        if (latestBlocksData.hasOwnProperty(key)) {
            const block = latestBlocksData[key];
            const row = document.createElement('tr');

            row.innerHTML = `
                <i class="pl-10 py-3 -mr-5 text-lg text-center fas fa-cube"></i>
                <td class="px-6 py-3 text-xs text-center">${block.number}</td>
                <td class="py-3 text-xs text-center">
                    ${typeof calculateTimeDifference(block.timestamp) === 'object'
                    ? `${calculateTimeDifference(block.timestamp).minutes}m 
                        ${calculateTimeDifference(block.timestamp).seconds}s ago`
                    : `${calculateTimeDifference(block.timestamp)}s ago`}
                </td>
                <td class="px-4 py-3 text-xs text-center text-blue-600 hover:underline cursor-pointer 
                ">${block.transactions.length} txns</td>
                <td class="pl-4 py-3 text-xs text-center">${block.miner}</td>
            `;

            blocksList.appendChild(row);
        }
    }
}

window.addEventListener('load',  async function() {
    const latestBlocksData = await fetchLatestBlocks();
     console.log(latestBlocksData);
    displayLatestBlocks(latestBlocksData);
});
  



  