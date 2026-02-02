import crypto from "crypto";
import fs from "fs";
import path from "path";

export default class CartManager {
  constructor() {
    this.path = path.resolve("src/data/carts.json");
  }

  async _readFile() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Error al leer el archivo de carritos");
    }
  }

  async _writeFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error("Error al escribir el archivo de carritos");
    }
  }

  async createCart() {
    const carts = await this._readFile();

    const newCart = {
      id: crypto.randomUUID(),
      products: [],
    };

    carts.push(newCart);
    await this._writeFile(carts);

    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find((c) => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) return null;

    const productIndex = carts[cartIndex].products.findIndex(
      (p) => p.product === productId,
    );

    if (productIndex === -1) {
      carts[cartIndex].products.push({
        product: productId,
        quantity: 1,
      });
    } else {
      carts[cartIndex].products[productIndex].quantity++;
    }

    await this._writeFile(carts);
    return carts[cartIndex];
  }
}
