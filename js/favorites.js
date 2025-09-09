// js/favorites.js

document.addEventListener('DOMContentLoaded', async () => {
    const favoritesContainer = document.getElementById('favorites-container');
    let allProductsData = []; // Para buscar los detalles de los productos favoritos

    // Cargar todos los productos una vez para poder encontrar los detalles de los favoritos
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProductsData = await response.json();
        displayFavoriteProducts();
    } catch (error) {
        console.error('Error al cargar la base de datos de productos para favoritos:', error);
        // En el catch de carga de productos base
        favoritesContainer.innerHTML = '<p class="error-message">No se pudieron cargar los datos de los productos para mostrar tus favoritos.</p>';
        return;
    }

    // Muestra los productos marcados como favoritos
    function displayFavoriteProducts() {
        const favoriteIds = getFavorites(); // Función de main.js
        favoritesContainer.innerHTML = ''; // Limpia el contenedor

        if (favoriteIds.length === 0) {
            // Cuando no hay favoritos
            favoritesContainer.innerHTML = '<p class="no-results">Todavía no has añadido ningún producto a tus favoritos. ¡Explora nuestro <a href="productos.html">catálogo</a>!</p>';
             return;
        }

        favoriteIds.forEach(favId => {
            const product = allProductsData.find(p => p.id === favId);
            if (product) {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.id = product.id; // Guarda el ID del producto

                productCard.innerHTML = `
                    <img src="${product.mainImage}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toFixed(2)} €</p>
                    <button class="favorite-button" data-id="${product.id}">
                        <i class="fas fa-star"></i> Quitar de favoritos
                    </button>
                `;
                favoritesContainer.appendChild(productCard);
            }
        });

        // Asigna eventos a los botones de favoritos para quitar de la lista
        document.querySelectorAll('.favorite-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const btn = event.currentTarget;
                const itemId = btn.dataset.id;
                toggleFavorite(itemId); // Quita de favoritos (función de main.js)
                // Elimina visualmente la tarjeta del producto de la lista
                btn.closest('.product-card').remove();
                // Si no quedan favoritos, actualiza el mensaje
                if (getFavorites().length === 0) {
                    favoritesContainer.innerHTML = '<p class="no-results">Todavía no has añadido ningún producto a tus favoritos. ¡Explora nuestro <a href="productos.html">catálogo</a>!</p>';
                }
            });
        });
    }
});