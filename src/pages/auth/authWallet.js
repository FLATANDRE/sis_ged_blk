import Web3 from "web3";

export async function connectWallet() {
    if(!window.ethereum) {
        console.log('No MetaMask found!');
        return false; 
    }
    
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if (!accounts || !accounts.length) {
        console.log('Wallet not found/allowed!');
        return false;
    }

    console.log('Loged on wallet: ' + accounts);
    return true;
}

