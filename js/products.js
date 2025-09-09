// js/products.js

document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('product-list-container');
    const filterButtons = document.querySelectorAll('.filter-button');
    let allProductsData = []; // Para almacenar todos los productos una vez cargados

    // Carga los productos desde el archivo JSON
    async function loadProducts() {
        try {
            const response = await fetch('https://opticaalberche.netlify.app/data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProductsData = await response.json();
        } catch (error) {
            console.warn('Fetch falló, intentando import dinámico...', error);
            try {


                const module = await import('https://opticaalberche.netlify.app/data/products.json', { assert: { type: 'json' } });



                allProductsData = module.default;
            } catch (importError) {
                console.error('Error al cargar los productos:', importError);
                productListContainer.innerHTML = '<p class="error-message">Lo sentimos, no pudimos cargar los productos en este momento. Por favor, inténtalo de nuevo más tarde.</p>';
                return;
            }
        }
        displayProducts(allProductsData); // Muestra todos los productos por defecto
    }

    // Muestra los productos en el DOM
    function displayProducts(productsToDisplay) {
        productListContainer.innerHTML = ''; // Limpia el contenedor

        if (productsToDisplay.length === 0) {
            // Cuando no hay productos para mostrar
            productListContainer.innerHTML = '<p class="no-results">No se encontraron productos para esta categoría.</p>';
             return;
        }

        productsToDisplay.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const idStr = String(product.id);
            productCard.dataset.id = idStr; // Guarda el ID del producto

            const isFavorite = checkFavoriteStatus(idStr); // Función de main.js

            productCard.innerHTML = `
                <img src="${product.mainImage}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.shortDescription}</p>
                <p class="price">${product.price.toFixed(2)} €</p>
                <button class="favorite-button" data-id="${idStr}">
                    ${isFavorite ? '<i class="fas fa-star"></i> Quitar de favoritos' : '<i class="far fa-star"></i> Añadir a favoritos'}
                </button>
            `;
            productCard.style.animationDelay = `${index * 100}ms`;
            productListContainer.appendChild(productCard);
        });

        // Asigna eventos a los botones de favoritos
        document.querySelectorAll('.favorite-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const btn = event.currentTarget;
                const itemId = btn.dataset.id;
                toggleFavorite(itemId); // Función de main.js
                // Actualiza el texto del botón al instante
                btn.innerHTML = checkFavoriteStatus(itemId)
                    ? '<i class="fas fa-star"></i> Quitar de favoritos'
                    : '<i class="far fa-star"></i> Añadir a favoritos';
            });
        });
    }

    // Maneja los clics en los botones de filtro de categoría
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Remueve la clase 'active' de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añade la clase 'active' al botón clickeado
            const btn = event.currentTarget;
            btn.classList.add('active');

            const category = btn.dataset.category;
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