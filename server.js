import mongoose from "mongoose";
import { app } from './app.js'

// const { DB_HOST, PORT } = process.env;

const DB_HOST = "mongodb+srv://Const:JlQda1zHa8Mddlmn@cluster0.uzcdmgi.mongodb.net/contacts_book?retryWrites=true&w=majority&appName=Cluster0"
const PORT = 6666;

mongoose.set('strictQuery', true);

mongoose
    .connect(DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch(({ message }) => {
        console.log(message);
        process.exit(1);
    });
