import {create} from "ipfs-http-client";
import App from "../App";

export const getAppIpfsInstance = () => {
    if (!App.ipfs) {
        const ipfs = create(import.meta.env.VITE_IPFS_SERVER_API);
        App.ipfs = ipfs;
    }
    return App.ipfs;
}