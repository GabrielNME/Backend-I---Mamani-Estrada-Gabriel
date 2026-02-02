import crypto from "crypto";
import fs from "fs";
import path from "path";

export default class ProductManager {
  constructor() {
    this.path = path.resolve("src/data/products.json");
  }

  async _readFile() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Error al leer el archivo de productos");
    }
  }

  async _writeFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error("Error al escribir el archivo de productos");
    }
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find((p) => p.id === id);
  }

  async addProduct(productData) {
    const products = await this._readFile();

    const newProduct = {
      id: crypto.randomUUID(),
      status: true,
      thumbnails: [],
      ...productData,
    };

    products.push(newProduct);
    await this._writeFile(products);

    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this._readFile();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updateData,
      id: products[index].id,
    };

    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const filteredProducts = products.filter((p) => p.id !== id);

    if (products.length === filteredProducts.length) return null;

    await this._writeFile(filteredProducts);
    return true;
  }
}
