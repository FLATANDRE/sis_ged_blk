import axios from "axios";

const apiUserProfile = axios.create({
    baseURL : import.meta.env.VITE_API_USER_PROFILE
});

apiUserProfile.defaults.headers.post['Content-Type'] = 'application/json';

export default apiUserProfile;

