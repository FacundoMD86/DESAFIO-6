import { model,Schema } from "mongoose";

let collection = "User"
let schema = new Schema({
    name: { type: String, required: true },
    photo: { type: String, default:'https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg' },
    mail: { type: String, unique: true, index: true, required: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0 }
})
let User = model (collection, schema);
export default User