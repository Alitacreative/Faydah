import axios from 'axios';

export class AuthApi {
    static login(email: string, password: string) {
        return axios.post('auth/login', { email, password });
    }

    static register(userData: any) {
        return axios.post('users', userData);
    }

    static logout() {
        return axios.post('auth/logout');
    }
}
