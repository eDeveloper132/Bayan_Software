import mongoose, { Model, Schema } from "mongoose";
import IProfile from "../interfaces/IProfile";

const ProfileSchema: Schema<IProfile> = new Schema(
  {
    username: { type: String, required: false },
    clerk_user_id: { type: String, required: true },
    email: { type: String, required: true },
    phonenumber: { type: String, required: false },
    outh_provider: { type: String, required: false, default: null },
    outh_provider_id: { type: String, required: false, default: null },
    outh_provider2: { type: String, required: false, default: null },
    outh_provider2_id: { type: String, required: false, default: null },
    image_url: { type: String, required: false },
  },
  { timestamps: true }
);

// Prevent model overwrite issue in Next.js hot reload
const ProfileModel: Model<IProfile> =
  mongoose.models.Profiles || mongoose.model<IProfile>("Profiles", ProfileSchema);

export { ProfileModel };