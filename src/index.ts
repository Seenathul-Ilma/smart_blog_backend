import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import postRoutes from "./routes/postRoutes"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { Role, Status, User } from "./models/userModels"
dotenv.config()   // configure the .env file

const SERVER_PORT = process.env.SERVER_PORT
const Mongo_URI = process.env.MONGO_URI as string

const DEFAULT_ADMIN_FIRSTNAME = process.env.DEFAULT_ADMIN_FIRSTNAME as string
const DEFAULT_ADMIN_LASTNAME = process.env.DEFAULT_ADMIN_LASTNAME
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL as string
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD as string

const app = express()

app.use(express.json())

app.use(cors({
    origin: ["http://localhost:5173"],  // frontend. not backend ("http://localhost:5000/")
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"]  // optional
}))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/post", postRoutes)
app.get("/",(req,res) => {
    res.send("Backend is running..!")
})

//app.use((req, res, next) => {
//    next()
//})

mongoose
    .connect(Mongo_URI)
    .then(async() => {
        console.log("MongoDB connected")

        try {
            const existingAdmin = await User.findOne({ roles: "ADMIN" })

            if(!existingAdmin) {
                const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)

                const newAdmin = new User({
                    firstname: DEFAULT_ADMIN_FIRSTNAME,
                    lastname: DEFAULT_ADMIN_LASTNAME,
                    email: DEFAULT_ADMIN_EMAIL,
                    password: hashedPassword,
                    roles: [Role.ADMIN],
                    approval: Status.APPROVED
                })

                await newAdmin.save()
                console.log(`Default admin created with email: ${DEFAULT_ADMIN_EMAIL} & password: ${DEFAULT_ADMIN_PASSWORD}.`);
            } else {
                console.log("Admin already exists. Skipping default admin creation..");
            }
        } catch (err) {
            console.error("Error creating default admin:", err);
        }
    })
    .catch((err)=>{
        console.error(`Error Connecting MongoDB: ${err}`)
        process.exit(1)   // DB eka connect vune nettam, exit venna
    })

/* mongo.then(()=>{
    console.log("MongoDB connected")
})
.catch((err)=>{
    console.error("Error Connecting MongoDB: ", err)
}) */

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on ${SERVER_PORT}`)
})