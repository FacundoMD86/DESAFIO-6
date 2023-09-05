import mongoose from "mongoose"

const URI="mongodb+srv://facundomd:11223344@fmd.cqejc72.mongodb.net/ecommerce?retryWrites=true&w=majority"

await mongoose.connect(URI,{
    serverSelectionTimeoutMS:5000,
})
console.log("Base de datos conectada....")