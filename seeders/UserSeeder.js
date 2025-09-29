import generateUsername from "../helpers/generateUsername.js";
import Role from "../models/Role.js";
import Topic from "../models/Topic.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
async function UserSeeder() {
  try {
    const hasckpassword = await bcrypt.hash("P@ss2025", 10);

    let user = {
      lastname: "ADMIN MC",
      firstname: "ADMIN",
      email: "kareltowanou123@gmail.com",
      password: hasckpassword,
      email_verified: true,
      is_active: true,
    };
    let username = await generateUsername(user);
    user.username = username;
    await User.findOneAndUpdate(
      { email: user.email },
      { $setOnInsert: user },
      { upsert: true, new: true }
    );
    console.log("Utilisateur inséré");
  } catch (error) {
    throw error;
  }
}
export default UserSeeder;
