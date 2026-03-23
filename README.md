# Backend-I---Mamani-Estrada-Gabriel


Proyecto final desarrollado para el curso de Backend en Coderhouse. Implementación de un servidor robusto con persistencia en MongoDB, WebSockets y motor de plantillas Handlebars.

##  Tecnologías Utilizadas
* **Node.js & Express:** Servidor base y ruteo.
* **MongoDB & Mongoose:** Base de datos NoSQL con plugin de paginación.
* **Handlebars:** Renderizado de vistas dinámicas en el servidor.
* **Socket.io:** Actualizaciones en tiempo real para el panel de administrador.
* **Dotenv:** Gestión segura de variables de entorno.

##  Funcionalidades Principales
* **Catálogo con Paginación:** Filtros por categoría, disponibilidad y ordenamiento de precios en la ruta `/products`.
* **Detalle de Producto:** Vista individual para cada artículo con su respectivo stock.
* **Gestión Real-Time:** Panel de administración en `/realtimeproducts` que permite agregar o eliminar productos con actualización instantánea mediante Sockets.
* **Sistema de Carritos:** API funcional para crear carritos y sumar productos mediante IDs, con persistencia total en la base de datos.

##  Configuración del Entorno
Para ejecutar el proyecto, crear un archivo `.env` en la raíz con:
```env
PORT=8080
MONGODB_CNXStr=mongodb://localhost:27017/ecommerce
ADMIN_PASSWORD=tu_clave_aqui