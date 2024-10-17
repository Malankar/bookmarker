import { v4 as uuidv4 } from "uuid";
import { db } from "../db/db.js";
import { user } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { userSchema } from "../utils/joiSchema.js";
import Joi from "joi";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/customError.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

const register = async (username, password) => {
  // Validate input data
  await userSchema.validateAsync({ username, password });

  // Check for existing user with the same username
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.username, username));

  if (existingUser.length) {
    throw ConflictError("User with this username already exists");
  }

  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db
    .insert(user)
    .values({ id, username, hashedPassword })
    .returning();

  return newUser[0];
};

const login = async (username, password) => {
  await userSchema.validateAsync({ username, password });
  const result = await db
    .select()
    .from(user)
    .where(eq(user.username, username));
  if (result.length === 0) {
    throw NotFoundError("User not found");
  }
  const user = result[0];
  if (bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    throw UnauthorizedError('Wrong password');
  }
};

const authService = {
  register,
  login,
};

export default authService;
