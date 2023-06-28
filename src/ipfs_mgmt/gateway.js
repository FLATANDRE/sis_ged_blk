import axios from "axios";

const apiIpfsGateway = axios.create({
    baseURL : import.meta.env.VITE_IPFS_CLUSTER_GATEWAY
});


export default apiIpfsGateway;

