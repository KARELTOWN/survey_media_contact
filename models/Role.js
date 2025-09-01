import mongoose from "../config/mongodb.js";

const Roleschema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      unique: [true, "Le role existe déjà"],
      sparse: true,
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", Roleschema);
export default Role;
