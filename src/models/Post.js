const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
    },
    category: {
      type: String,
      enum: ["tecnología", "educación", "entretenimiento", "otro"],
      default: "otro",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
