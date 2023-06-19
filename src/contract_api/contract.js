import Web3 from "web3";
import contract from "@truffle/contract";
import DocumentManagement from "./DocumentManagement.json";

export const configureContractDocumentManagementInstance = () => {
    const web3 = new Web3(window.ethereum);
    if(!web3) {console.error("App web3 not configured properly"); return;}

    const contracts = JSON.parse(localStorage.getItem("contracts"));
    contracts.DocumentManagement = contract(DocumentManagement);
    contracts.DocumentManagement.setProvider(web3);    
    localStorage.setItem("contracts",JSON.stringify(contracts));
}

export const getContractDocumentManagementInstance = () => {
    const contracts = JSON.parse(localStorage.getItem("contracts"));
    if(!contracts.DocumentManagement) configureContractDocumentManagementInstance();
    return contracts.DocumentManagement.deployed();
}