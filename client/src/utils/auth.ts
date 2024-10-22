import { type JwtPayload, decode } from "jsonwebtoken";

// Extended JWT structure to include user data.
interface ExtendedJwt extends JwtPayload {
  data: {
    _id: string;
    email: string;
    username: string;
  };
}

class AuthService {
  // Decode the token to extract user data.
  getProfile() {
    return (decode(localStorage.getItem('id_token') || '') as ExtendedJwt)?.data;
  }

  // Check if the user is logged in.
  loggedIn() {
    const token = this.getAuthToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if the token is expired.
  isTokenExpired(token: string): boolean {
    try {
      const decoded = decode(token) as JwtPayload;
      return decoded.exp ? Date.now() >= decoded.exp * 1000 : false;
    } catch (err) {
      return true;
    }
  }

  // Get the authentication token from localStorage.
  getAuthToken() {
    return localStorage.getItem('id_token');
  }

  // Store the token and redirect the user.
  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Remove the token and log out the user.
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
