import { db } from "./connection.ts";
import { users, subject, attendance, notes } from "./schema.ts";
import { users as initialUsers } from "../constants/users.ts";
import { hashPassword } from "../utils/password.ts";
import { fileURLToPath } from "node:url";

const seed = async () => {
  console.log("Starting DB seed");

  try {
    console.log("Clearing existing entries");
    // Depending on FK relations, the deletion order may cause an FK constraint error
    await db.delete(attendance);
    await db.delete(notes);
    await db.delete(subject);
    await db.delete(users);
    console.log("Creating all students...");

    await Promise.all(
      initialUsers.map(async (user) => {
        const hashedPassword = await hashPassword(user.password);
        await db.insert(users).values({
          email: user.email,
          username: user.username,
          password: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.role as unknown as ("teacher" | "student" | "admin")[],
        });
      }),
    );
    console.log("Succesfully created all users...");
  } catch (e) {
    console.error("DB Seed failed", e);
    process.exit(1);
  }
};

console.log(
  "Seed",
  fileURLToPath(import.meta.url),
  process.argv[1],
  fileURLToPath(import.meta.url) === process.argv[1],
  import.meta.url === process.argv[1],
);

if (fileURLToPath(import.meta.url) === `${process.argv[1]}`) {
  console.log("Starting seed");
  seed()
    .then(() => process.exit(0))
    .catch((e) => process.exit(1));
}

export default seed;
