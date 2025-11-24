import mongoose, { Document, Schema } from "mongoose"

interface IAuth extends Document{
    email: string
    password: string
}

const authSchema = new Schema<IAuth>(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
)

export const Auth = mongoose.model<IAuth>("Auth", authSchema)