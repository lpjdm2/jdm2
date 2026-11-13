// ============================================================
// SCRIPT PRINCIPAL - CORREGIDO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. MODO OSCURO / CLARO ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Comprobar preferencia guardada en localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // --- 2. MENÚ HAMBURGUESA (MÓVIL) ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Cerrar menú móvil al hacer click en un enlace
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // --- 3. ANIMACIONES FADE-IN (SCROLL) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // --- 4. FILTRO DE PRODUCTOS (MEJORADO) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Activar botón seleccionado
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                // Obtener la categoría del producto (puede tener múltiples valores separados por espacio o barra)
                const cardCategory = card.getAttribute('data-category') || '';
                // Dividir por espacios o barras, y limpiar
                const categories = cardCategory.split(/[\s\/]+/).filter(c => c.trim() !== '');
                
                // Si el filtro es 'all', mostrar todo; si no, comprobar si el valor está en las categorías
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    // Verificar si alguna de las categorías del producto coincide con el filtro
                    if (categories.some(cat => cat.toLowerCase() === filterValue.toLowerCase())) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // --- 5. BOTÓN VOLVER ARRIBA ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 6. VALIDACIÓN DE FORMULARIO DE CONTACTO Y MENSAJE DE ÉXITO ---
    const contactForm = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Validar mensaje
            if (messageInput.value.trim().length < 10) {
                e.preventDefault();
                messageError.style.display = 'block';
                return;
            } else {
                messageError.style.display = 'none';
            }

            // Si la validación pasa, mostramos el mensaje de éxito (opcional)
            // Nota: como el formulario se envía a FormSubmit, la página se recargará.
            // Para evitar la recarga y mostrar éxito con AJAX, necesitarías fetch.
            // Como usas action directo, dejamos que se envíe normalmente.
            // Pero podemos mostrar el mensaje si queremos evitar la recarga (comentado)
            // Si prefieres que no recargue, usa fetch. Por ahora, dejamos que funcione con FormSubmit.
            // Sin embargo, si quieres mostrar éxito sin recargar, descomenta las líneas:
            /*
            e.preventDefault();
            // Enviar con fetch (requiere modificar el action)
            // ... 
            formSuccess.style.display = 'block';
            contactForm.reset();
            */
        });
    }

    // --- 7. CARRUSEL HERO (CORREGIDO Y UNIFICADO) ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track ? track.children : []);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const indicatorsContainer = document.getElementById('indicators');
    const dots = indicatorsContainer ? Array.from(indicatorsContainer.children) : [];

    // Solo ejecutar si existen los elementos del carrusel
    if (track && slides.length > 0 && nextBtn && prevBtn && indicatorsContainer) {
        let currentIndex = 0;
        let slideInterval;
        const autoPlayDelay = 5000;

        function goToSlide(index) {
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            // Reiniciar animación del texto al cambiar de slide
            const activeSlideContent = slides[currentIndex].querySelector('.slide-content');
            if (activeSlideContent) {
                activeSlideContent.style.animation = 'none';
                activeSlideContent.offsetHeight; // trigger reflow
                activeSlideContent.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        }

        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-index'));
                if (!isNaN(targetIndex)) {
                    goToSlide(targetIndex);
                    resetAutoPlay();
                }
            });
        });

        function startAutoPlay() {
            slideInterval = setInterval(() => goToSlide(currentIndex + 1), autoPlayDelay);
        }

        function resetAutoPlay() {
            clearInterval(slideInterval);
            startAutoPlay();
        }

        const carouselElem = document.getElementById('hero-slider');
        if (carouselElem) {
            carouselElem.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carouselElem.addEventListener('mouseleave', () => startAutoPlay());
        }

        startAutoPlay();
    }

    // --- 8. (OPCIONAL) Mostrar mensaje de éxito si viene de redirección ---
    // Si el formulario redirige a la misma página con un parámetro, se puede mostrar.
    // Ejemplo: si la URL contiene ?success=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const successMsg = document.getElementById('form-success');
        if (successMsg) {
            successMsg.style.display = 'block';
            // Ocultar el formulario
            const form = document.getElementById('contactForm');
            if (form) form.style.display = 'none';
        }
    }
});