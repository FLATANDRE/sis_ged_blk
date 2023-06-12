import contract from "@truffle/contract";
import DocumentManagemet from "./DocumentManagement.json";
import App from "../App";

export const configureContractDocumentManagementInstance = () => {
    const web3 = App.web3;
    App.contracts.DocumentManagement = contract(DocumentManagemet);
    App.contracts.DocumentManagement.setProvider(App.web3);    
}

export const getContractDocumentManagementInstance = () => {
    if(!App.contracts.DocumentManagement) configureContractInstance();
    return App.contracts.DocumentManagement.deployed();
}