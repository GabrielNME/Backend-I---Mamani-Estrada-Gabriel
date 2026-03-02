import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import ProductManager from "./managers/productManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const port = 8080;

// 🔹 Crear servidor HTTP manualmente
const httpServer = createServer(app);

// 🔹 Inicializar Socket.io
const io = new Server(httpServer);

app.set("io", io);

const productManager = new ProductManager();
// 🔹 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// 🔹 Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);

// 🔹 Conexión de sockets
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);
});
// 🔹 Escuchar servidor
httpServer.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
