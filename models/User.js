import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [5, "Minimum 5 caractères"],
      maxlength: [15, "Maximum 15 caractères"],
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Cet email est déjà utilisé"],
      sparse: true, //Rend l'index unique applicable uniquement aux documents qui ont une valeur pour ce champ.
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    code: {
      type: String,
      default: "+229",
    },
    phone: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
