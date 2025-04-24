import { Document } from "mongoose";
interface IProfile extends Document {
    username?: string;
    clerk_user_id: string;
    email: string;
    phonenumber?: string;
    outh_provider?: string;
    outh_provider_id?: string;
    outh_provider2?: string;
    outh_provider2_id?: string;
    image_url?: string;
}
export default IProfile;