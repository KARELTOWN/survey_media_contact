import mongoose from "../config/mongodb.js";

const DirectionSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: [true, "Le code de la Direction existe déjà"],
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

const Direction = mongoose.model("Direction", DirectionSchema);
export default Direction;
