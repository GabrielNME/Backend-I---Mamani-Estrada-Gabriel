export const adminAuth = (req, res, next) => {

    const { password } = req.query;

    // Contraseña en README.txt
    if (password === process.env.ADMIN_PASSWORD) {
        return next();
    }

    res.status(401).render("error", { 
        message: "Acceso no autorizado. Contraseña de administrador incorrecta." 
    });
};