//import {create} from "ipfs-http-client";
import { Cluster } from "@nftstorage/ipfs-cluster";

export const getIpfsClusterInstance = () => {
        //return create(import.meta.env.VITE_IPFS_SERVER_API)
        return new Cluster(import.meta.env.VITE_IPFS_CLUSTER);        
}