import axios from "axios";

const apiDocMetadata = axios.create({
    baseURL : import.meta.env.VITE_API_DOCUMENT_METADATA
});

export default apiDocMetadata;

