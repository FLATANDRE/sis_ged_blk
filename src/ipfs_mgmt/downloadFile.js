import apiIpfsGateway from './gateway.js';

export const downloadFileFromIpfs = async (CID) => {
    if (CID) {
        const response = await apiIpfsGateway.get(`/ipfs/${CID}`, { responseType : 'blob'});    
        const downloadUrl = window.URL.createObjectURL(response.data);
        window.open(downloadUrl, '__blank');
        window.URL.revokeObjectURL(downloadUrl);
    }
}