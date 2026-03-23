import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import ProductManager from "./managers/productManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import "dotenv/config"
import { connectDB } from "./config/db.js";

const app = express();
const port = process.env.PORT;


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
app.engine("handlebars", engine({
    helpers: {
        eq: (a, b) => a === b,
        multiplicar: (a, b) => a * b,
        ifStockDisponible: (stock, cantidad, options) => {
        return (stock > cantidad) ? options.fn(this) : options.inverse(this);
        
    },
    totalCart: (products) => {
            let total = 0;
            products.forEach(item => {
                total += item.product.price * item.quantity;
            });
            return total;
        }
    }
}));
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// 🔹 Rutas API

// 🔹 Redirección de la raíz al catálogo de productos
app.get("/", (req, res) => {
    res.redirect("/products");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);

// 🔹 Conexión de sockets
io.on("connection", async (socket) => {
  console.log("Admin conectado");

  const products = await productManager.getAllProducts();
  socket.emit("updateProducts", products);
});

app.post("/api/products", async (req, res) => {
    try {
    const products = await productManager.getProducts(); 
  
    socket.emit("updateProducts", products);
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(500).send({ status: "error" });
    }
});
// 🔹Conexión MongoDB
connectDB();
// 🔹 Escuchar servidor
httpServer.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
