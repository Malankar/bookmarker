import dotenv from "dotenv";
dotenv.config();

export const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  routes: { login: false },
  session: {
    absoluteDuration: 24 * 60 * 60, // 24 hours
    rolling: true,
  },
};

export const jwtConfig = {
  audience: process.env.AUTH_AUDIENCE,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
};
