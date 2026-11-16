// ============================================
// COMERCIAL HERMANAS RISCO - APP.JS
// Funcionalidades interactivas de la tienda
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. MENÚ HAMBURGUESA RESPONSIVE
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('nav-mobile');
    const navMobileLinks = document.querySelectorAll('.nav-mobile-link');

    // Toggle del menú móvil
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMobile.classList.toggle('active');

        // Prevenir scroll del body cuando el menú está abierto
        if (navMobile.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Cerrar menú al hacer click en un enlace
    navMobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // 2. HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ============================================
    // 3. NAVEGACIÓN ACTIVA (SCROLL SPY)
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // 4. ANIMACIONES AL HACER SCROLL
    // ============================================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    function checkScrollReveal() {
        const triggerBottom = window.innerHeight * 0.85;

        scrollRevealElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                // Añadir delay escalonado para efecto cascada
                setTimeout(() => {
                    element.classList.add('revealed');
                }, index * 100);
            }
        });
    }

    // Ejecutar al cargar y al hacer scroll
    checkScrollReveal();
    window.addEventListener('scroll', checkScrollReveal);

    // ============================================
    // 5. BÚSQUEDA DE PRODUCTOS
    // ============================================
    const searchInput = document.getElementById('search-input');
    const productCards = document.querySelectorAll('#products-grid .product-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();

        productCards.forEach(card => {
            const productName = card.getAttribute('data-name').toLowerCase();
            const productTitle = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('.product-desc').textContent.toLowerCase();

            if (productName.includes(searchTerm) || 
                productTitle.includes(searchTerm) || 
                productDesc.includes(searchTerm)) {
                card.style.display = '';
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Si no hay resultados, mostrar mensaje (opcional)
        updateNoResultsMessage();
    });

    function updateNoResultsMessage() {
        const visibleCards = document.querySelectorAll('#products-grid .product-card:not(.hidden)');
        const existingMessage = document.querySelector('.no-results');

        if (visibleCards.length === 0 && searchInput.value.trim() !== '') {
            if (!existingMessage) {
                const message = document.createElement('div');
                message.className = 'no-results';
                message.innerHTML = '<p style="text-align:center; color:var(--gray); font-size:1.1rem; padding:40px 0;"><i class="fas fa-search" style="font-size:2rem; margin-bottom:15px; display:block;"></i>No se encontraron productos. Intenta con otra búsqueda.</p>';
                document.getElementById('products-grid').appendChild(message);
            }
        } else if (existingMessage) {
            existingMessage.remove();
        }
    }

    // ============================================
    // 6. FILTRADO POR CATEGORÍAS
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filter === 'todos') {
                    card.style.display = '';
                    card.classList.remove('hidden');
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filter) {
                        card.style.display = '';
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });

            // Limpiar mensaje de no resultados si existe
            const existingMessage = document.querySelector('.no-results');
            if (existingMessage) existingMessage.remove();

            // Limpiar input de búsqueda
            searchInput.value = '';
        });
    });

    // ============================================
    // 7. CARRUSEL AUTOMÁTICO DE OFERTAS
    // ============================================
    const track = document.getElementById('offers-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    let currentSlide = 0;
    let autoSlideInterval;
    const totalSlides = 5; // Número total de ofertas

    // Crear dots indicadores
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Oferta ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        // Calcular el ancho de cada tarjeta + gap
        const cardWidth = 325; // 300px + 25px gap
        track.style.transform = 'translateX(-' + (currentSlide * cardWidth) + 'px)';

        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        updateCarousel();
        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Event listeners para botones
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-slide cada 4 segundos
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Pausar auto-slide al hover
    track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    track.addEventListener('mouseleave', startAutoSlide);

    // ============================================
    // 8. BOTÓN VOLVER ARRIBA
    // ============================================
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // 9. MENSAJE EMERGENTE DE BIENVENIDA
    // ============================================
    const welcomeModal = document.getElementById('welcome-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const welcomeClose = document.getElementById('welcome-close');
    const welcomeBtn = document.getElementById('welcome-btn');

    // Mostrar modal después de 1.5 segundos
    setTimeout(() => {
        // Verificar si ya se mostró en esta sesión
        if (!sessionStorage.getItem('welcomeShown')) {
            welcomeModal.classList.add('active');
            modalOverlay.classList.add('active');
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }, 1500);

    // Cerrar modal
    function closeWelcomeModal() {
        welcomeModal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }

    welcomeClose.addEventListener('click', closeWelcomeModal);
    welcomeBtn.addEventListener('click', closeWelcomeModal);
    modalOverlay.addEventListener('click', closeWelcomeModal);

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && welcomeModal.classList.contains('active')) {
            closeWelcomeModal();
        }
    });

    // ============================================
    // 10. EFECTO HOVER EN TARJETAS DE PRODUCTOS
    // ============================================
    const allProductCards = document.querySelectorAll('.product-card');

    allProductCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ============================================
    // 11. BOTONES DE PRODUCTO (FEEDBACK VISUAL)
    // ============================================
    const productBtns = document.querySelectorAll('.product-btn');

    productBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

            // Animación de click
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Cambiar icono temporalmente
            const icon = this.querySelector('i');
            const originalClass = icon.className;
            icon.className = 'fas fa-check';
            this.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-light))';

            setTimeout(() => {
                icon.className = originalClass;
                this.style.background = '';
            }, 1000);
        });
    });

    // ============================================
    // 12. SMOOTH SCROLL PARA ANCLAS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 13. HERO SCROLL INDICATOR
    // ============================================
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const nosotrosSection = document.getElementById('nosotros');
            if (nosotrosSection) {
                window.scrollTo({
                    top: nosotrosSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ============================================
    // 14. DETECTAR TAMAÑO DE PANTALLA (RESPONSIVE)
    // ============================================
    function handleResize() {
        const width = window.innerWidth;

        // Ajustar carrusel en móvil
        if (width <= 768) {
            track.style.transform = 'translateX(0px)';
            currentSlide = 0;
        }
    }

    window.addEventListener('resize', handleResize);

    // ============================================
    // 15. CONSOLA - MENSAJE DE BIENVENIDA
    // ============================================
    console.log('%c Comercial Hermanas Risco ', 'background: linear-gradient(135deg, #E63946, #F4A261); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
    console.log('%c Bienvenido a nuestra tienda online! ', 'color: #1D3557; font-size: 14px;');

}); // Fin DOMContentLoaded
