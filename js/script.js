document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMACIÓN SCROLL (Aparición suave al bajar)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    });
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    // 2. ANIMACIÓN INICIAL DEL NAVBAR (Para que no aparezca de golpe)
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        setTimeout(() => {
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
        }, 100);
    }

    // 3. GALERÍA: CAMBIAR IMAGEN EN EL VISOR
    window.changeImage = function(src, title) {
        const mainImg = document.getElementById('main-display');
        const mainTitle = document.getElementById('viewer-title');
        
        if (mainImg) {
            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = src;
                if(mainTitle) mainTitle.innerText = title;
                mainImg.style.opacity = 1;
            }, 300);
        }
    };

    // 4. CARRUSEL 3D (Botones + Arrastre)
    const carousel = document.querySelector('.carousel-3d');
    const wrapper = document.getElementById('carouselWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentAngle = 0;
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;

    const rotateCarousel = (angle) => {
        if(carousel) carousel.style.transform = `rotateY(${angle}deg)`;
    };

    // Botones de giro
    if (carousel && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentAngle += 18; 
            rotateCarousel(currentAngle);
        });
        nextBtn.addEventListener('click', () => {
            currentAngle -= 18;
            rotateCarousel(currentAngle);
        });
    }

    // Lógica Drag & Swipe (Mouse y Dedo)
    if (wrapper && carousel) {
        // MOUSE
        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            startAngle = currentAngle;
            wrapper.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.pageX;
            const walk = (x - startX) * 0.5; 
            currentAngle = startAngle + walk;
            rotateCarousel(currentAngle);
        });
        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.cursor = 'grab';
        });

        // TOUCH (Móvil)
        wrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            startAngle = currentAngle;
        });
        wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 0.8; 
            currentAngle = startAngle + walk;
            rotateCarousel(currentAngle);
        });
        wrapper.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // 5. MODAL (LIGHTBOX - Pantalla Completa)
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const mainImg = document.getElementById('main-display');

    window.openModal = function() {
        if(modal && mainImg) {
            modal.style.display = "block";
            modalImg.src = mainImg.src;
            const titleEl = document.getElementById('viewer-title');
            if(titleEl) captionText.innerHTML = titleEl.innerText;
        }
    };

    window.closeModal = function() {
        if(modal) modal.style.display = "none";
    };

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") window.closeModal();
    });

// 6. FORMULARIO Y CAPTCHA (Envío en segundo plano sin salir de la web)
    window.toggleCaptcha = function(element) {
        element.classList.toggle('checked');
    };
    
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Frenamos la recarga de la página SIEMPRE
            
            const captcha = document.querySelector('.fake-captcha');
            
            // 1. Validar nuestro Captcha visual
            if (captcha && !captcha.classList.contains('checked')) {
                alert("🤖 Por favor, verifica que no eres un robot.");
                return;
            }

            // 2. Cambiar el texto del botón para dar feedback de que está procesando
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "ENVIANDO...";
            submitBtn.disabled = true; // Evitamos que hagan doble clic
            
            // 3. Preparar los datos y enviarlos silenciosamente
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Le pedimos a Formspree que no nos redirija
                    }
                });
                
                if (response.ok) {
                    // ¡Éxito total!
                    alert("✅ ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
                    contactForm.reset(); // Vaciamos los campos de texto
                    captcha.classList.remove('checked'); // Destildamos el captcha
                } else {
                    // Error del servidor
                    alert("❌ Hubo un problema al enviar el mensaje. Por favor, revisa tus datos e intenta de nuevo.");
                }
            } catch (error) {
                // Error de conexión (sin internet, etc.)
                alert("❌ Error de red. Por favor, verifica tu conexión a internet.");
            } finally {
                // Pase lo que pase, restauramos el botón a su estado normal
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // 7. IMÁGENES ROTAS (Protección)
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (this.src.includes('placehold.co')) return;
            this.src = 'https://placehold.co/600x400/111/333?text=Sin+Imagen';
        });
    });
    // 8. LOGICA PARA EL MODAL DE CORREO Y BOTON WHATSAPP
    window.openEmailModal = function() {
        const modal = document.getElementById('emailModal');
        if(modal) modal.style.display = 'block';
    };

    window.closeEmailModal = function() {
        const modal = document.getElementById('emailModal');
        if(modal) modal.style.display = 'none';
    };

    window.sendWhatsApp = function() {
        // Configuramos el número de 3Esfera (Formato internacional de Argentina: 54 + 9 + codigo de area + numero)
        const phone = "5493435314141"; 
        const message = "¡Hola 3Esfera! Me comunico desde la página web, me gustaría hacerles una consulta.";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Cerrar el modal si el usuario hace click afuera de la caja
    window.addEventListener('click', function(event) {
        const emailModal = document.getElementById('emailModal');
        // Usamos también imageModal por si el usuario está en la galería
        const imageModal = document.getElementById('imageModal'); 
        
        if (event.target == emailModal) {
            closeEmailModal();
        }
        if (event.target == imageModal && typeof closeModal === 'function') {
            closeModal();
        }
    });
    // 9. MENÚ HAMBURGUESA PARA MÓVILES
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');


    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            // Abre y cierra la persiana del menú
            navLinks.classList.toggle('active');
            
            // Cambia el icono de las 3 rayitas por una "X" y viceversa
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
// 10. INDICADOR LATERAL: OCULTAR AL SCROLLEAR, REAPARECER, Y ESCONDER AL FINAL
    const scrollIndicator = document.getElementById('scrollIndicator');
    let scrollTimeout;

    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            // 1. Calculamos si el usuario llegó al final de la página (con 20px de margen de seguridad)
            const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 20);

            // 2. Limpiamos el temporizador siempre que haya movimiento
            clearTimeout(scrollTimeout);

            if (isAtBottom) {
                // Si tocó el fondo, apagamos la barrita para siempre y no dejamos que reaparezca
                scrollIndicator.style.opacity = '0';
            } else {
                // Si NO está en el fondo, aplicamos la lógica normal de desaparecer al moverse
                if (window.scrollY > 150) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }

                // Y volvemos a iniciar la cuenta regresiva de 5 segundos para que reaparezca
                scrollTimeout = setTimeout(() => {
                    scrollIndicator.style.opacity = '1';
                }, 5000);
            }
        });
    }
// 11. GENERAR ZÓCALOS DE TEXTO EN GALERÍA MÓVIL AUTOMÁTICAMENTE
    const cells = document.querySelectorAll('.carousel-cell');
    
    cells.forEach(cell => {
        const onclickAttr = cell.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes("changeImage")) {
            // Buscamos el texto que pusiste entre comillas en el changeImage
            const match = onclickAttr.match(/changeImage\('.*?',\s*'(.*?)'\s*\)/);
            
            if (match && match[1]) {
                const textoDescripcion = match[1];
                
                // Creamos el zócalo negro con el texto
                const caption = document.createElement('div');
                caption.className = 'mobile-caption';
                caption.innerText = textoDescripcion;
                
                // Lo metemos adentro de la foto
                cell.appendChild(caption);
            }
        }
    });
});
