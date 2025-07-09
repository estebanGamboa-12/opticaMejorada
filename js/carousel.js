// js/carousel.js

document.addEventListener('DOMContentLoaded', () => {
    let slideIndex = 0; // Índice de la diapositiva actual
    const slides = document.querySelectorAll('.carousel-slide'); // Todas las diapositivas
    const dots = document.querySelectorAll('.dot'); // Todos los puntos de navegación
    const prevButton = document.querySelector('.prev'); // Botón "anterior"
    const nextButton = document.querySelector('.next'); // Botón "siguiente"
    let slideInterval; // Variable para almacenar el ID del temporizador de avance automático

    // Función principal para mostrar una diapositiva específica
    function showSlides(n) {
        // Si no hay diapositivas en el DOM, sal de la función para evitar errores
        if (slides.length === 0) {
            console.warn("No se encontraron diapositivas para el carrusel. Asegúrate de que los elementos con la clase 'carousel-slide' existen en el HTML.");
            return;
        }

        // Limpia cualquier temporizador de avance automático existente para evitar múltiples ejecuciones
        clearInterval(slideInterval);

        // Ajusta el índice de la diapositiva para que el carrusel sea cíclico
        if (n >= slides.length) {
            slideIndex = 0; // Si se supera el último slide, vuelve al primero
        } else if (n < 0) {
            slideIndex = slides.length - 1; // Si se retrocede del primero, va al último
        } else {
            slideIndex = n; // Establece el índice de la diapositiva actual
        }

        // Oculta todas las diapositivas y las deja con opacidad 0
        slides.forEach(slide => {
            slide.classList.remove('active'); // Remueve la clase 'active' de todas las diapositivas
            slide.style.opacity = 0;          // Establece la opacidad a 0 (para la transición de salida)
            slide.style.visibility = 'hidden'; // Oculta completamente para que no reciba eventos
        });

        // Desactiva visualmente todos los puntos de navegación
        dots.forEach(dot => {
            dot.classList.remove('active'); // Remueve la clase 'active' de todos los puntos
        });

        // Muestra la diapositiva actual y activa el punto correspondiente
        if (slides[slideIndex]) { // Asegúrate de que la diapositiva en el índice existe
            slides[slideIndex].style.visibility = 'visible'; // Hace visible el slide antes de la transición de opacidad
            slides[slideIndex].classList.add('active');      // Añade la clase 'active' (que pondrá opacity: 1 en CSS)
        }
        if (dots[slideIndex]) { // Asegúrate de que el punto en el índice existe
            dots[slideIndex].classList.add('active'); // Activa el punto correspondiente
        }

        // Reinicia el temporizador de avance automático después de mostrar la diapositiva
        startSlideShow();
    }

    // Función para avanzar o retroceder diapositivas
    function plusSlides(n) {
        showSlides(slideIndex + n);
    }

    // Función para ir directamente a una diapositiva específica (usada por los puntos de navegación)
    function currentSlide(n) {
        showSlides(n);
    }

    // Función para iniciar el avance automático del carrusel
    function startSlideShow() {
        clearInterval(slideInterval); // Limpia cualquier intervalo anterior para evitar duplicados
        slideInterval = setInterval(() => {
            plusSlides(1); // Avanza a la siguiente diapositiva
        }, 5000); // El carrusel cambiará de diapositiva cada 5 segundos (5000 milisegundos)
    }

    // --- Inicialización y Asignación de Event Listeners ---

    // Asegurarse de que el DOM esté completamente cargado antes de ejecutar el script
    // (Esta parte ya está envuelta en document.addEventListener('DOMContentLoaded', ...))

    // Asigna los event listeners para los botones de navegación (flechas)
    if (prevButton) {
        prevButton.addEventListener('click', () => plusSlides(-1)); // Retrocede al hacer clic en "anterior"
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => plusSlides(1)); // Avanza al hacer clic en "siguiente"
    }

    // Asigna los event listeners para los puntos de navegación
    if (dots.length > 0) { // Solo si hay puntos de navegación
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => currentSlide(index)); // Va al slide correspondiente al hacer clic en el punto
        });
    }

    // Muestra la primera diapositiva (índice 0) al cargar la página e inicia el ciclo automático
    showSlides(slideIndex); // Esto también iniciará el 'slideInterval'
});