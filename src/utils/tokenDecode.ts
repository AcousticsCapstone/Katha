import {jwtDecode} from 'jwt-decode';
interface DecodedToken {
  username: string;
  email: string;
  accountType: string;
  exp: number;
  iat: number;
}

const getUserDetailsFromToken = (token: string): DecodedToken | null => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};

export default getUserDetailsFromToken;
