import Web3 from "web3";
import contract from "@truffle/contract";
import DocumentManagement from "./DocumentManagement.json";

export const configureContractDocumentManagementInstance = () => {
    let instance = contract(DocumentManagement);
    instance.setProvider(window.ethereum);    
    return instance;
}

export const getContractDocumentManagementInstance = async () => {
    const instance = configureContractDocumentManagementInstance();
    return await instance.deployed();
}