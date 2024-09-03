import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      maxlength: 25,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: 15,
    },
    infra_type: {
      type: String,
      required: true,
    },
    hasSetQuest: {
      type: Boolean,
      default: false,
    },
    slct_quest: {
      type: String,
    },
    quest_ans: {
      type: String,
      maxlength: 25,
    },
    email_toggled: {
      type: Boolean,
      default: true,
    },
    image_toggled: {
      type: Boolean,
      default: true,
    },
    accntnum_toggled: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isModerator: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
