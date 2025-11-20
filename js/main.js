// js/main.js

// --- Funciones para manejar localStorage de favoritos ---

/**
 * Obtiene la lista de IDs de productos favoritos del localStorage.
 * @returns {Array<string>} Un array de IDs de productos favoritos.
 */
function getFavorites() {
    try {
        const favorites = localStorage.getItem('opticaAlbercheFavorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (e) {
        console.error("Error al leer favoritos del localStorage:", e);
        return [];
    }
}

/**
 * Guarda un array de IDs de productos en el localStorage como favoritos.
 * @param {Array<string>} favorites - El array de IDs de productos a guardar.
 */
function saveFavorites(favorites) {
    try {
        localStorage.setItem('opticaAlbercheFavorites', JSON.stringify(favorites));
    } catch (e) {
        console.error("Error al guardar favoritos en localStorage:", e);
    }
}

/**
 * Comprueba si un producto específico es favorito.
 * @param {string} itemId - El ID del producto a comprobar.
 * @returns {boolean} True si el producto es favorito, false en caso contrario.
 */
function checkFavoriteStatus(itemId) {
    const favorites = getFavorites();
    return favorites.includes(itemId);
}

/**
 * Añade o quita un producto de la lista de favoritos.
 * @param {string} itemId - El ID del producto a alternar.
 */
function toggleFavorite(itemId) {
    let favorites = getFavorites();
    const index = favorites.indexOf(itemId);

    if (index > -1) {
        // El producto ya está en favoritos, lo quitamos
        favorites.splice(index, 1);
        console.log(`Elemento ${itemId} eliminado de favoritos.`);
    } else {
        // El producto no está en favoritos, lo añadimos
        favorites.push(itemId);
        console.log(`Elemento ${itemId} añadido a favoritos.`);
    }
    saveFavorites(favorites);
}

// --- Lógica general para el encabezado (resaltar el enlace activo) ---
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPath = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo HTML

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Lógica del Menú de Hamburguesa ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body; // Para evitar scroll al abrir el menú
    const themeToggle = document.getElementById('theme-toggle');

    // Tema claro por defecto; si existe un botón de tema respeta la preferencia guardada
    const storedTheme = localStorage.getItem('theme');
    if (themeToggle && storedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    const updateThemeIcon = () => {
        if (!themeToggle) return;
        themeToggle.innerHTML = body.classList.contains('dark-mode')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    };
    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
        });
    }

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            body.classList.toggle('no-scroll'); // Añade/quita clase al body para deshabilitar scroll
        });

        // Opcional: Cerrar el menú si se hace clic en un enlace (para SPA-like navigation)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Solo cierra si el menú está activo (en móvil)
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            });
        });
    }
});

