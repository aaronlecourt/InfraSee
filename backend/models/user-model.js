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
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    infra_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InfrastructureType",
      required: true,
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
      default: false,
    },
    isSubModerator: {
      type: Boolean,
      default: false,
    },
    assignedModerator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subModerators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    deactivated: {
      type: Boolean,
      default: false, 
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving
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

// Middleware to handle deactivation and reactivation of submoderators
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  // If deactivating the moderator, deactivate all their submoderators
  if (update.deactivated === true) {
    const moderatorId = this.getQuery()._id;

    // Deactivate all submoderators assigned to this moderator
    await mongoose.model('User').updateMany(
      { assignedModerator: moderatorId, isSubModerator: true },
      { $set: { deactivated: true } }
    );
  } 
  // If reactivating the moderator, reactivate all their submoderators
  else if (update.deactivated === false) {
    const moderatorId = this.getQuery()._id;

    // Reactivate all submoderators assigned to this moderator
    await mongoose.model('User').updateMany(
      { assignedModerator: moderatorId, isSubModerator: true, deactivated: true },
      { $set: { deactivated: false } }
    );
  }

  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
