import mongoose, { Document, Schema } from "mongoose"

export enum Role {
    ADMIN="ADMIN",
    AUTHOR="AUTHOR", 
    USER="USER"
}

export enum Status {
    APPROVED="APPROVED",
    PENDING="PENDING",
    REJECTED="REJECTED"
}

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId,   // _id   (why use underscore in js? - to represent as private variable)
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    roles: Role[],
    approval: Status,
}

const userSchema = new Schema<IUser>(
    {
        //_id: { type: String, required: true },    // don't add - will add automatically
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true},
        password: { type: String, required: true },
        roles: { type: [String], enum: Object.values(Role), default: [Role.USER] },
        approval: { type: String, enum: Object.values(Status), default: Status.PENDING }
    },
    { timestamps: true }  // The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date. 
)

export const User = mongoose.model<IUser>("User", userSchema)