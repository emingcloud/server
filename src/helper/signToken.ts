import jwt from "jsonwebtoken";
export default function signToken(payload: any) {
  const accessToken = jwt.sign(payload, process.env.jwt_secret!, {
    expiresIn: "15m",
  });
  return accessToken;
}
