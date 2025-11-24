import mongoose, { Document, Schema } from "mongoose"

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId
    title: string       // typescript
    content: string
    tags: string[],
    imageURL: string    // to store the url of the file in db
    author: mongoose.Types.ObjectId  // to store author's id
    createdAt?: Date
    updatedAt?: Date
}

// mongo db eke data koi vidihatada save venna one kiyl define krnna (bcz, no tables in mongodb)
const postSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },      // String - mongoose data type to strings
        content: { type: String, required: true }, 
        tags: { type: [String] },
        imageURL: { type: String },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true }  // mongodb is non-relational db. so need to define a relationship (relationship vage ekak) between user & post
        // userModel eke -> export const User = mongoose.model<IUser>("User", userSchema) - methana mention karapu "User" eka thamai 'ref' reference vidihata gatte - connection hadaganna
    },
    {
        timestamps: true   // request eka aapu timezone eka adhala na. server/backend eka thiyana place ekata adhalava request krpu time eka thamai store venne 
    }
)

export const Post = mongoose.model<IPost>("Post", postSchema)

