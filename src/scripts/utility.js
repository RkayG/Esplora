// ------- FUNCTIONS ----------
// calculateTimeDifference(timestamp);
// shortenAddress(address);
// transactionType(num);


/** UTILITYY FUNCTION, CALCULATES THE DIFFERENCE BETWEEN BLOCK TIMESTAMP AND CURRENT TIMESTAMP
 * IN SECONDS AND MINUTES e.g 12 secs ago, 1 min 23 secs ago 
 */
export function calculateTimeDifference(timestamp) {
    const currentTimestamp = Date.now(); // Get current timestamp in milliseconds
    const difference = currentTimestamp - (timestamp * 1000); // Calculate difference in milliseconds

    // Convert to seconds and ensure a non-negative value
    const seconds = Math.floor(Math.max(0, difference / 1000));

    // Calculate minutes if seconds exceed 59
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Return an object with minutes and remaining seconds (or just seconds if < 60)
    return minutes > 0 ? { minutes, seconds: remainingSeconds } : seconds;

}

// ------- UTILITY FUNCTION TO SHORTEN ADDRESS ----------
export function shortenAddress(address) {
    const prefixLength = 6; // Length to keep at the beginning (e.g., 0x)
    const suffixLength = 4; // Length to keep at the end
    const middleEllipsis = '...';
  
    if (address.length <= prefixLength + suffixLength) {
      return address; // Address is too short, don't modify
    }
  
    return `${address.slice(0, prefixLength)}${middleEllipsis}${address.slice(-suffixLength)}`;
}

// ---- UTILITY FUNCTION TO INTERPRET TRANSACTION TYPE
export function transactionType(num) {
    const transactionTypes = {
        0: 'Transfer',
        1: 'Contract creation',
        2: 'Contract call',
        3: 'Reserved',
      };
    
    return transactionTypes[num];
}

// ----- UTILITY FUNCTION TO CONVERT WEI TO ETH
export function convertWeiToEth(transactionValueInWei) {
    if (!transactionValueInWei) {
      return 0;
    }
  
    const weiInNumber = typeof transactionValueInWei === 'string' ? parseInt(transactionValueInWei, 16) : transactionValueInWei;
  
    // Assuming 1 Ether is equal to 1e18 Wei 
    const etherValue = weiInNumber / 1e18;
  
    // Format the Ether value with comma separators (optional)
    return etherValue.toLocaleString();
}