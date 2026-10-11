import mongoose, { Document } from "mongoose";

interface ISocialLinks {
    youtube?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
}

interface IPartnerProfile {
    slug?: string;
    bio?: string;
    website?: string;
    socialLinks?: ISocialLinks;
}

interface IPaymentDetails {
    method: "upi" | "bank";
    upiId?: string;
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
}

export interface IUser extends Document {
    firebaseUid: string;
    name: string;
    email: string;
    role: "admin" | "partner";
    partnerProfile: IPartnerProfile;
    paymentDetails: IPaymentDetails;
    totalSales: number;
    totalRevenue: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        role: {
            type: String,
            enum: ["admin", "partner"],
            default: "partner",
            index: true
        },
        partnerProfile: {
            slug: {
                type: String,
                unique: true,
                index: true
            },
            bio: {
                type: String,
                trim: true
            },
            website: {
                type: String,
                default: ""
            },
            socialLinks: {
                youtube: { type: String, default: "" },
                facebook: { type: String, default: "" },
                linkedin: { type: String, default: "" },
                instagram: { type: String, default: "" }
            }
        },
        paymentDetails: {
            method: {
                type: String,
                enum: ["upi", "bank"],
                default: "upi"
            },
            upiId: { type: String, default: "" },
            accountHolderName: { type: String, default: "" },
            accountNumber: { type: String, default: "" },
            ifscCode: { type: String, default: "" }
        },
        totalSales: {
            type: Number,
            default: 0,
            min: 0
        },
        totalRevenue: {
            type: Number,
            default: 0,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;