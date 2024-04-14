const express = require('express');
const cors = require('cors');
const { Network, Alchemy } = require('alchemy-sdk');
const ethers = require('ethers')
const { AlchemyProvider } = require('@ethersproject/providers');
require('dotenv').config();
const axios = require('axios');

const app = express();
const port = 3000;
app.use(cors());

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET, 
  };
  
const alchemy = new Alchemy(settings);
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/* const alchemyApiKey = `T6zqja4KpaKU-TBsfPUaRY6PQ0baC3br`;

const provider = new AlchemyProvider('mainnet', {
    apiKey: alchemyApiKey,
    url: 'wss://eth-mainnet.g.alchemy.com/v2/T6zqja4KpaKU-TBsfPUaRY6PQ0baC3br' 
});
 */

/* Fetch Ethereum Price, Marketcap, and total transactions */
app.get('/ethInfo', async (req, res) => {
    try {
        const ethPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const ethMarketcapResponse = await await axios.get('https://api.coingecko.com/api/v3/coins/ethereum');
        const totalTransactionsResponse = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum');

        const ethPrice = ethPriceResponse.data.ethereum.usd;
        const ethMarketcap = ethMarketcapResponse.data.market_data.market_cap.usd;
        const ethereumTotalTransactions = totalTransactionsResponse.data.market_data.total_transactions;

        // Respond with JSON containing ETH price, marketcap, and total transactions 
        res.json({ 
            ethPrice: ethPrice.toString(),
            ethMarketcap: ethMarketcap,
            //ethTotalTransactions: ethereumTotalTransactions.toString(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/* Fetch Total Blocks */
app.get('/totalBlocks', async (req, res) => {
    try { 
        const blockNumber = await alchemy.core.getBlockNumber();
        res.json({ totalBlocks: blockNumber });
    } catch (error) {
        console.error('Error fetching total blocks: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

/* Fetch Average Block Time in Seconds */
app.get('/averageBlockTime', async (req, res) => {
    try {
        const latestBlock = await alchemy.core.getBlock('latest');
        const blockNumber = latestBlock.number;
        
        const previousBlock = await alchemy.core.getBlock(blockNumber - 1);
        
        const latestTimestamp = latestBlock.timestamp;
        const previousTimestamp = previousBlock.timestamp;
        
        const timeDifference = latestTimestamp - previousTimestamp;
        
        // Average block time in seconds
        const averageBlockTime = timeDifference / 2;

        res.json({ averageBlockTimeSeconds: averageBlockTime });
    } catch (error) {
        console.error('Error fetching average block time:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

app.get('/totalTransactionCount', async (req, res) => {
    try {
        // GET request to the Etherscan API to fetch the latest block information
        const response = await axios.get('https://api.etherscan.io/api', {
            params: {
                module: 'proxy',
                action: 'eth_blockCount',
                apikey: ETHERSCAN_API_KEY, // Replace this with your Etherscan API key
            },
        });

        // Extract the total transaction count from the response
        const totalTransactionCount = parseInt(response.data.result, 16);
        console.log(totalTransactionCount);

        res.json({ totalTransactionCount: totalTransactionCount });
    } catch (error) {
        console.error('Error fetching total transactions count:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

/** Fetch Latest Blocks */
app.get('/latest-blocks', async (req, res) => {
    try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        const numBlocks = parseInt(req.query.count) || 10;
        const lastXBlocks = [];

        // Loop to retrieve the last 10 blocks
        for (let i = latestBlockNumber; i >= latestBlockNumber - (numBlocks - 1); i--) {
            const block = await alchemy.core.getBlockWithTransactions(i);
            lastXBlocks.push(block);
        }
        res.json(lastXBlocks);
       // res.json(data.data.slice(0, 10));
      } catch (error) {
        if (error.isAlchemyError) {
          console.error('Error from Alchemy API:', error);
          res.status(500).json({ error: 'Error fetching data from Alchemy' });
        } else {
          console.error('Internal Server Error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
  });

  /** Fetch Latest transactions */
app.get('/latest-transactions', async (req, res) => {
    try {
        const latestTransactions = await alchemy.core.getTransactions({ limit: 10 });

        console.log(latestTransactions);
        res.json(latestTransactions);
    } catch (error) {
        console.error('Error fetching latest transactions:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});