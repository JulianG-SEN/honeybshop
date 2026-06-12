HoneyB Shampoo Sólido — Tienda Web
Proyecto desarrollado para el parcial de Diseño Web Avanzado. Tienda de comercio electrónico para HoneyB, marca colombiana de shampoo sólido sin plástico ni sulfatos.
URL desplegada: https://honeybshop.vercel.app  
Framework: React + Vite  
Componente interactivo: Carrito drawer con sincronización múltiple (Nivel 1 → Nivel 3)

Componente interactivo implementado
Se implementó un carrito de compras dinámico con las siguientes características:
Drawer lateral que abre y cierra sin recargar la página.
Contador en el header que se actualiza en tiempo real cada vez que se agrega o elimina un producto.
Subtotal por ítem que se recalcula en vivo al cambiar la cantidad.
Total general (subtotal + envío) sincronizado automáticamente con cada cambio.
Filtro en vivo por tipo de cabello y búsqueda libre que reordena el catálogo mientras el usuario escribe.
El estado del carrito se refleja simultáneamente en tres puntos de la interfaz: el badge del header, el panel del drawer y el footer con el total. Ninguna de estas actualizaciones recarga la página.

Análisis del referente: Native (nativecos.com)
¿Qué es Native?
Native es una tienda DTC (Direct-to-Consumer) estadounidense de productos de cuidado personal natural. Su sitio está construido sobre Shopify, verificado con la extensión Wappalyzer, que detectó: Shopify como plataforma de e-commerce, Cloudflare como CDN y HTTP/3 como protocolo de red.
Descripción de la interfaz
La tienda de Native presenta un catálogo de productos con navegación por categorías en el header. El diseño es limpio, con jerarquía visual clara y llamados a la acción directos. El elemento más relevante para este análisis es su carrito lateral (drawer), que se activa al agregar cualquier producto al carrito.
Cómo funciona el patrón interactivo del cart drawer
1. Apertura del drawer  
Al hacer clic en "Add to cart" en cualquier producto, un panel aparece deslizándose desde el lado derecho de la pantalla. El fondo de la página se oscurece con una capa semitransparente (overlay), bloqueando la interacción con el contenido principal mientras el carrito está abierto. En ningún momento la página se recarga ni cambia de URL.
2. Qué cambia en el estado  
Cuando se agrega un producto, el estado de la aplicación se actualiza en tres puntos simultáneamente:
El ícono del carrito en el header muestra un badge con el número total de unidades. Este contador cambia inmediatamente, sin ninguna recarga.
El panel del drawer muestra el ítem recién agregado con su nombre, precio unitario y cantidad.
El subtotal en la parte inferior del drawer refleja el valor acumulado de todos los productos.
3. Actualización de cantidades en vivo  
Dentro del drawer, cada ítem tiene botones para aumentar o disminuir la cantidad. Al presionarlos, el subtotal de ese ítem y el total general se recalculan instantáneamente. No hay ningún botón de "actualizar carrito" ni recarga de página: el cambio es inmediato porque el estado vive en memoria dentro del componente de la aplicación.
4. Qué NO se recarga  
En ningún momento durante la interacción con el carrito se recarga la página. El catálogo de productos permanece exactamente igual detrás del overlay. La URL no cambia. Solo se actualiza la porción del DOM correspondiente al drawer y al badge del header.
Por qué esto es interactividad con estado y no decoración
La diferencia entre una animación decorativa y un componente con estado es que el segundo modifica datos que afectan a otras partes de la interfaz. En el caso del cart drawer de Native:
Agregar un producto modifica el array de ítems del carrito (estado).
Ese cambio de estado dispara la actualización del contador del header, el listado del drawer y el total, todo al mismo tiempo.
Si se cierra y se vuelve a abrir el drawer, los productos siguen ahí: el estado persiste durante la sesión.
Una animación decorativa (hover de color, texto que aparece al hacer scroll) no modifica ningún dato ni afecta otras partes de la interfaz. El cart drawer sí lo hace, por eso es un componente interactivo con estado.
Relación con el proyecto HoneyB
El patrón observado en Native es exactamente el que se implementó en HoneyB Shampoo Sólido. Ambos comparten la misma arquitectura de interacción:
Característica	Native 	HoneyB 
Drawer desde la derecha	Si	Si
Overlay al abrir	Si	Si
Contador en header en vivo	Si	Si
Subtotal por ítem en vivo	Si	Si
Total sincronizado	Si	Si
Sin recarga de página	Si	Si
Filtro en vivo del catálogo	No	Si
HoneyB agrega además un filtro en vivo por tipo de cabello y una búsqueda libre que no están presentes en Native, lo que eleva la interactividad al nivel de sincronización múltiple.

Estructura del proyecto
```
honeybshop/
├── src/
│   ├── App.jsx        # Componente principal, estado del carrito y lógica de filtros
│   ├── main.jsx       # Punto de entrada de React
│   └── index.css      # Reset global
├── public/
├── index.html
├── vite.config.js
└── package.json
```

Cómo correr el proyecto localmente
```bash
npm install
npm run dev
```
Abre `http://localhost:5173` en el navegador.