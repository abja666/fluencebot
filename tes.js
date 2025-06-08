require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Baca file dan parsing
function loadRecipients(filename) {
  const lines = fs.readFileSync(filename, 'utf-8').split('\n').filter(Boolean);
  return lines.map(line => {
    const [address, amount] = line.trim().split(/\s+/);
    return { address, amount };
  });
}

async function sendBulkETH() {
  const recipients = loadRecipients('recipients.txt');
  for (const { address, amount } of recipients) {
    const tx = {
      to: address,
      value: ethers.parseEther(amount),
    };
    try {
      const transaction = await wallet.sendTransaction(tx);
      console.log(`✅ Sent ${amount} ETH to ${address} | txHash: ${transaction.hash}`);
      await transaction.wait();
    } catch (err) {
      console.error(`❌ Failed to send to ${address}:`, err.message);
    }
  }
}

sendBulkETH();