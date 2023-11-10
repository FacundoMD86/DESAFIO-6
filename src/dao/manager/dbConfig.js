import mongoose from "mongoose";

const LINK_DB = 'mongodb+srv://facundomd:11223344@fmd.cqejc72.mongodb.net/fmd';

mongoose.connect(LINK_DB, {
    serverSelectionTimeoutMS: 5000,
  });
  
  console.log('Base de datos conectada....');
  
  export default mongoose;
