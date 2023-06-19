import {create} from "ipfs-http-client";

export const getAppIpfsInstance = () => {
    var ipfs = JSON.parse(localStorage.getItem("ipfs"));
    if (!ipfs) {
        ipfs = create(import.meta.env.VITE_IPFS_SERVER_API)
        localStorage.setItem("ipfs", JSON.stringify(ipfs));
    }
    return ipfs;
}