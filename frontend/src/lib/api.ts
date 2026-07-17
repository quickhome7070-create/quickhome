const BASE_URL =
process.env.NEXT_PUBLIC_API_URL;


export const API = {

  register:
  `${BASE_URL}/auth/register`,


  login:
  `${BASE_URL}/auth/login`,


  verifyOTP:
  `${BASE_URL}/auth/verify-otp`,


  otpLogin:
  `${BASE_URL}/auth/otp-login`,


  me:
  `${BASE_URL}/auth/me`,


  logout:
  `${BASE_URL}/auth/logout`,


};