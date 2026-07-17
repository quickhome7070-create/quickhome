const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;


export const API = {

  register:
    `${BASE_URL}/auth/register`,


  verifyOTP:
    `${BASE_URL}/auth/verify-otp`,


  login:
    `${BASE_URL}/auth/login`,


  me:
    `${BASE_URL}/auth/me`,


  logout:
    `${BASE_URL}/auth/logout`,


};