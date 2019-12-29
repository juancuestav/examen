const express = require("express");
const path = require("path");

// Inicializar 
const app = express();
app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
  console.log("Servidor escuchando en puerto: 3000");
});

// static files
app.use(express.static(path.join(__dirname, "public")));