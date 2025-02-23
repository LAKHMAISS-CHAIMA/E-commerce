require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const produitRoutes = require("./routes/produitRoutes");

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

app.use("/api/produits", produitRoutes);

io.on("connection", (socket) => {
  console.log("Un client est connecté");

  socket.on("disconnect", () => {
    console.log("Un client s'est déconnecté");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));

module.exports = { io };
