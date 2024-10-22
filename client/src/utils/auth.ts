import { type JwtPayload, decode } from "jsonwebtoken";

interface ExtendedJwt extends JwtPayload {
    data:{
        _id:string;
        email:string;
        username:string;
    }
};

class AuthService {
    getProfile() {
        // Using jwtDecode to decode the token
        return (decode(localStorage.getItem('id_token') || '') as ExtendedJwt)?.data;
    }

    loggedIn() {
        const token = this.getAuthToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token: string): boolean {
        try {
            const decoded = decode(token) as JwtPayload;
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                return true;
            }
        } catch (err) { 
            return true;
        }
        return false;
    }
    getProfileData() {
        return decode(localStorage.getItem('id_token') || '') as ExtendedJwt;
    }
    getAuthToken() {
        return localStorage.getItem('id_token');
    }
    login(idToken: string) {
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }
    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
}

export default new AuthService();