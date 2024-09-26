import mongoose from "mongoose";

const connection = { "isConnected": 0 }

async function dbconn() {
    if (connection.isConnected) {
        console.log("Already Connected");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || " ")
        connection.isConnected = db.connections[0].readyState;
        console.log("db Connected");
    } catch (e) {
        console.log("Database Connection fail");
    }
}

export default dbconn;
