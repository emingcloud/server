import { v4 as uuidv4 } from "uuid";
import { db } from "../service/db";
interface UserSignup {
  username: string;
  email: string;
  password: string;
}

export const UserRepository = {
  signup: async function (user: UserSignup) {
    const query =
      "INSERT INTO users (id, username, email, created_at) VALUES (?, ?, ?, ?)";

    const params = [uuidv4(), user.username, user.email, new Date()];
    await db.execute(query, params, { prepare: true });
  },
  getUsers: async function () {},
  getUser: async function () {},
};
