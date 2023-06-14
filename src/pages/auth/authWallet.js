import Web3 from "web3";
import {configureContractDocumentManagementInstance} from "../../contract_api/contract";
import App from "../../App";

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
    App.accounts = accounts;
    App.web3 = web3;
    App.contracts = {};
    
    console.log('Loged on wallet: ' + accounts);
    configureContractDocumentManagementInstance();
    return true;
}

