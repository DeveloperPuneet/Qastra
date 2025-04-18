// * importing modules
const app = require("express")();
const mongoose = require("mongoose");
const http = require("http").Server(app);
const io = require("socket.io")(http);

// * importing files
const config = require("./config/config");
const router = require("./Routes/router");

// * variables
const PORT = config.port;

// * Database connection
const ConnectDB = async () => {
    try {
        await mongoose.connect(config.db).then(() => {
            console.log("Database connected ✨");
        }).catch((error) => {
            setTimeout(ConnectDB, 20000);
            console.warn("Qastra fail code: 1");
        });
    } catch (error) {
        console.log(error);
    }
}
ConnectDB();

// * setup route
app.use("/", router);

// * socket.io stuff
io.on("connection", (socket) => {
    socket.on("disconnect", () => {
    });
});

// * building server
http.listen(PORT, () => {
    try {
        console.log(`build sucessfully 🪓`);
    } catch (error) {
        console.log(error);
        console.warn("Qastra fail code: 2");
    }
});