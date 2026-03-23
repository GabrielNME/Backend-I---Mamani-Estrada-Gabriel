import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const url = process.env.MONGODB_CNXStr
        
        await mongoose.connect(url);
        console.log("✅ Conexión exitosa a MongoDB");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
};