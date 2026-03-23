import { CartModel } from "../models/cart.model.js";


export default class CartManager {
  // 1. Crear carrito nuevo
  async createCart() {
    try {
      return await CartModel.create({ products: [] });
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  // 2. Obtener carrito con POPULATE
  async getCartById(cid) {
    try {
      const cart = await CartModel.findById(cid)
        .populate("products.product")
        .lean();
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  // 3. Agregar producto
  async addProductToCart(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito");
    }
  }

  // 4. Elimina un producto específico del carrito
  async removeProduct(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) return null;

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== pid
      );

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }

  // 5. Actualizar TODO el array de productos
  async updateCart(cid, products) {
    try {
      return await CartModel.findByIdAndUpdate(
        cid,
        { products },
        { new: true }
      );
    } catch (error) {
      throw new Error("Error al actualizar el carrito");
    }
  }

  // 6. Actualizar SÓLO la cantidad de un producto específico
  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) return null;

      const item = cart.products.find((p) => p.product.toString() === pid);
      if (!item) return null;

      item.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar la cantidad");
    }
  }

  // 7. Vaciar cart
  async clearCart(cid) {
    try {
      return await CartModel.findByIdAndUpdate(
        cid,
        { products: [] },
        { new: true }
      );
    } catch (error) {
      throw new Error("Error al vaciar el carrito");
    }
  }

  // 8. FINALIZAR COMPRA 
  async purchaseCart(cid) {
    try {
      const cart = await CartModel.findById(cid).populate("products.product");
      if (!cart) return null;

      let totalAmount = 0;
      const outOfStock = []; 

      for (const item of cart.products) {
        const product = item.product;

        // Validar disponibilidad
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
          totalAmount += product.price * item.quantity;
        } else {
          outOfStock.push({
            product: product._id,
            quantity: item.quantity
          });
        }
      }

      // ACtualizacion cart
      cart.products = outOfStock;
      await cart.save();

      return {
        amount: totalAmount,
        unprocessedProducts: outOfStock.map(p => p.product)
      };
    } catch (error) {
      throw new Error("Error al procesar la compra: " + error.message);
    }
  }
}