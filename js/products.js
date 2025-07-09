// js/products.js

document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('product-list-container');
    const filterButtons = document.querySelectorAll('.filter-button');
    let allProductsData = []; // Para almacenar todos los productos una vez cargados

    // Carga los productos desde el archivo JSON
    async function loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProductsData = await response.json();
            displayProducts(allProductsData); // Muestra todos los productos por defecto
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            // En el catch de loadProducts
            productListContainer.innerHTML = '<p class="error-message">Lo sentimos, no pudimos cargar los productos en este momento. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }

    // Muestra los productos en el DOM
    function displayProducts(productsToDisplay) {
        productListContainer.innerHTML = ''; // Limpia el contenedor

        if (productsToDisplay.length === 0) {
            // Cuando no hay productos para mostrar
            productListContainer.innerHTML = '<p class="no-results">No se encontraron productos para esta categoría.</p>';
             return;
        }

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id; // Guarda el ID del producto

            const isFavorite = checkFavoriteStatus(product.id); // Función de main.js

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price.toFixed(2)} €</p>
                <button class="favorite-button" data-id="${product.id}">
${isFavorite ? '<i class="fas fa-star"></i> Quitar de favoritos' : '<i class="far fa-star"></i> Añadir a favoritos'}   
             </button>
            `;
            productListContainer.appendChild(productCard);
        });

        // Asigna eventos a los botones de favoritos
        document.querySelectorAll('.favorite-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                toggleFavorite(itemId); // Función de main.js
                // Actualiza el texto del botón al instante
                if (checkFavoriteStatus(itemId)) {
                    event.target.innerHTML = '<i class="fas fa-star"></i> Quitar de favoritos';
                } else {
                    event.target.innerHTML = '<i class="far fa-star"></i> Añadir a favoritos';
                }
            });
        });
    }

    // Maneja los clics en los botones de filtro de categoría
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Remueve la clase 'active' de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añade la clase 'active' al botón clickeado
            event.target.classList.add('active');

            const category = event.target.dataset.category;
            let filteredProducts = [];

            if (category === 'all') {
                filteredProducts = allProductsData;
            } else {
                filteredProducts = allProductsData.filter(product => product.category === category);
            }
            displayProducts(filteredProducts);
        });
    });

    // Carga los productos al iniciar la página
    loadProducts();
});