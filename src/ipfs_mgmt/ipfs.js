import {create} from "ipfs-http-client";
import App from "../App";

export const getAppIpfsInstance = () => {
    if (!App.ipfs) {
        const ipfs = create('http://127.0.0.1:5001/api/v0');
        App.ipfs = ipfs;
    }
    return App.ipfs;
}