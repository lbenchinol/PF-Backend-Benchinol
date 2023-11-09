import mongoose from "mongoose";

export const init = async () => {
    try {
        const URI = 'mongodb+srv://developer:ZR84Vj4ZoQxi7sXZ@cluster0.fpmqsp0.mongodb.net/ecommerce';
        await mongoose.connect(URI);
        console.log(`Base de datos conectada!`);
    } catch (error) {
        console.log(`Ocurrio un error al conectar a la DB`, error.message);
    }

}