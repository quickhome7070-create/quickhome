const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API = {
  register: `${BASE_URL}/auth/register`,
  login: `${BASE_URL}/auth/login`,
  properties: `${BASE_URL}/properties`,
};
