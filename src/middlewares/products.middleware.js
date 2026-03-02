export const validateProduct = (isUpdate = false) => {
  return (req, res, next) => {
    const { title, description, code, price, stock, category, status } =
      req.body;

    // Campos obligatorios solo en creación
    if (!isUpdate) {
      if (
        !title ||
        !description ||
        !code ||
        price === undefined ||
        stock === undefined ||
        !category
      ) {
        return res.status(400).json({
          status: "error",
          message: "Faltan campos obligatorios",
        });
      }
    }

    if (title && typeof title !== "string")
      return res.status(400).json({
        status: "error",
        message: "El título debe ser un string",
      });

    if (description && typeof description !== "string")
      return res.status(400).json({
        status: "error",
        message: "La descripción debe ser un string",
      });

    if (code && typeof code !== "string")
      return res.status(400).json({
        status: "error",
        message: "El código debe ser un string",
      });

    if (price !== undefined && (typeof price !== "number" || price <= 0))
      return res.status(400).json({
        status: "error",
        message: "El precio debe ser un número mayor a 0",
      });

    if (stock !== undefined && (typeof stock !== "number" || stock < 0))
      return res.status(400).json({
        status: "error",
        message: "El stock debe ser un número válido",
      });

    if (category && typeof category !== "string")
      return res.status(400).json({
        status: "error",
        message: "La categoría debe ser un string",
      });

    // 🔥 NUEVO: validación explícita de status (lo pidió tu profe)
    if (status !== undefined && typeof status !== "boolean") {
      return res.status(400).json({
        status: "error",
        message: "El campo status debe ser boolean (true o false)",
      });
    }

    next();
  };
};
