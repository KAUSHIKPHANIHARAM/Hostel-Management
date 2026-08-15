import { authApi } from '../services/api';

export const registerUser = async (formObj) => {
    return authApi.register(formObj);
};

export default {
    registerUser
};
