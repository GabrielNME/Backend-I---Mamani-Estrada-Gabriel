import { ProductModel } from "../models/product.model.js";

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const filter = {};
      if (query) {
        if (query === "disponible") filter.stock = { $gt: 0 };
        else if (query === "true" || query === "false") filter.status = query === "true";
        else filter.category = query;
      }

      const options = {
        page,
        limit,
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
        lean: true,
      };

      const result = await ProductModel.paginate(filter, options);

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
      };
    } catch (error) {
      throw new Error("Error al obtener productos paginados");
    }
  }

  async getAllProducts() {
    try {
      return await ProductModel.find().lean(); 
    } catch (error) {
      throw new Error("Error al obtener la lista completa de productos");
    }
  }

  async getProductById(id) {
    return await ProductModel.findById(id).lean();
  }

  async addProduct(productData) {
    const newProduct = await ProductModel.create(productData);
    return newProduct.toObject();
  }

  async deleteProduct(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

async updateProduct(id, updateData) {
    try {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    } catch (error) {
        console.error("Error al actualizar producto en Manager:", error);
        throw new Error("Error al actualizar el producto");
    }
}
}