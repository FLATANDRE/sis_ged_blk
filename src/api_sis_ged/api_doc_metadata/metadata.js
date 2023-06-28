import axios from "axios";

const apiDocMetadata = axios.create({
    baseURL : import.meta.env.VITE_API_DOCUMENT_METADATA
});

apiDocMetadata.defaults.headers.post['Content-Type'] = 'application/json';

export default apiDocMetadata;

