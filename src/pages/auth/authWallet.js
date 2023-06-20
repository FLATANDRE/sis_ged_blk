import Web3 from "web3";
import {configureContractDocumentManagementInstance} from "../../contract_api/contract";

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
    localStorage.setItem("eth.accounts", JSON.stringify(accounts));
    localStorage.setItem("contracts", JSON.stringify({}));
    
    console.log('Loged on wallet: ' + accounts);
    configureContractDocumentManagementInstance();
    return true;
}

export const getEthAccounts = () => {
    return JSON.parse(localStorage.getItem("eth.accounts"));
}

export const getContracts = () => {
    return JSON.parse(localStorage.getItem("contracts"));
}