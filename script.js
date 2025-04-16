document.addEventListener('DOMContentLoaded', function() {
    // Loader
    const loader = document.querySelector('.loader');
    
    // Esconder loader quando a página carregar
    function hideLoader() {
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 4000);
        }
    }
    
    window.addEventListener('load', hideLoader);

    // Cursor personalizado
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    function initCustomCursor() {
        // Verificar se é um dispositivo touch
        if ('ontouchstart' in window || !cursor || !cursorFollower) {
            document.body.style.cursor = 'auto';
            return;
        }

        let lastMove = 0;
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        let isHovering = false;

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMove < 16) return; // ~60fps
            lastMove = now;
            
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Animação suave para o follower
        function animateFollower() {
            const diffX = mouseX - followerX;
            const diffY = mouseY - followerY;
            
            followerX += diffX * 0.2;
            followerY += diffY * 0.2;
            
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        // Efeito de hover no cursor
        const hoverElements = document.querySelectorAll('a, button, .project-card, .tech-icon, .portfolio-filter, .hamburger, input[type="submit"], [data-cursor-hover]');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
                isHovering = true;
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
                isHovering = false;
            });
        });

        // Adaptar para elementos de formulário
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('focus', () => {
                cursor.style.opacity = '0';
                cursorFollower.style.opacity = '0';
            });
            
            el.addEventListener('blur', () => {
                cursor.style.opacity = '1';
                cursorFollower.style.opacity = '1';
            });
        });
    }
    initCustomCursor();
    
    // Menu mobile
    function initMobileMenu() {
        const menuToggle = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuOverlay = document.querySelector('.menu-overlay');
        const navLinks = document.querySelectorAll('.mobile-menu a');
        
        if (!menuToggle || !mobileMenu || !menuOverlay) return;
        
        function toggleMenu() {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            
            // Acessibilidade
            const isExpanded = menuToggle.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        }
        
        menuToggle.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu();
            });
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }
    initMobileMenu();
    
    // Scroll suave
    function initSmoothScroll() {
        // Polyfill para navegadores antigos
        if (!('scrollBehavior' in document.documentElement.style)) {
            import("https://esm.sh/smoothscroll-polyfill").then(module => module.polyfill());
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Atualizar URL sem recarregar a página
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            });
        });
    }
    initSmoothScroll();
    
    // Header scroll
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;
        
        let lastScroll = 0;
        const headerHeight = header.offsetHeight;
        
        function updateHeader() {
            const currentScroll = window.scrollY;
            
            if (currentScroll <= 0) {
                header.classList.remove('scrolled');
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > headerHeight) {
                header.classList.add('scrolled', 'hidden');
            } else {
                header.classList.remove('hidden');
                if (currentScroll > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            lastScroll = currentScroll;
        }
        
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }
    initHeaderScroll();
    
    // Alternar tema
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Atualizar ícone
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
        
        // Verificar tema salvo ou preferência do sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (systemPrefersDark) {
            setTheme('dark');
        }
    }
    initThemeToggle();
    
    // Efeito de digitação (se Typed.js estiver disponível)
    function initTypedEffect() {
        const typedElement = document.querySelector('.typed-effect');
        if (!typedElement || typeof Typed === 'undefined') return;
        
        new Typed(typedElement, {
            strings: [
                'Desenvolvedora Front-End',
                'Designer UI/UX',
                'Especialista em Tailwind',
                'Entusiasta de Tecnologia'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            smartBackspace: true
        });
    }
    // Carregar Typed.js dinamicamente
    if (document.querySelector('.typed-effect')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12';
        script.onload = initTypedEffect;
        document.head.appendChild(script);
    }
    
    // Particles.js - Efeito de partículas
    function initParticles() {
        const particlesEl = document.getElementById('particles-js');
        if (!particlesEl || typeof particlesJS === 'undefined') return;
        
        try {
            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: 70, 
                        density: { 
                            enable: true, 
                            value_area: 800 
                        } 
                    },
                    color: { 
                        value: "#3b82f6" 
                    },
                    shape: { 
                        type: "circle" 
                    },
                    opacity: { 
                        value: 0.5,
                        random: true 
                    },
                    size: { 
                        value: 4, 
                        random: true 
                    },
                    line_linked: { 
                        enable: true, 
                        distance: 150, 
                        color: "#ffffff", 
                        opacity: 0.4, 
                        width: 1 
                    },
                    move: { 
                        enable: true, 
                        speed: 5, 
                        direction: "none",
                        out_mode: "bounce"
                    }
                },
                interactivity: {
                    detect_on: "window",
                    events: {
                        onhover: { 
                            enable: true, 
                            mode: "grab" 
                        },
                        onclick: { 
                            enable: true, 
                            mode: "push" 
                        },
                        resize: true
                    },
                    modes: {
                        grab: { 
                            distance: 140, 
                            line_linked: { 
                                opacity: 1 
                            } 
                        },
                        push: { 
                            particles_nb: 4 
                        }
                    }
                },
                retina_detect: true
            });
        } catch (error) {
            console.error('Error initializing particles:', error);
        }
    }
    // Carregar particles.js dinamicamente
    if (document.getElementById('particles-js')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = initParticles;
        document.head.appendChild(script);
    }
    
    // Filtro de projetos
    function initProjectFilter() {
        const filterButtons = document.querySelectorAll('.portfolio-filter');
        const projectItems = document.querySelectorAll('.portfolio-item');
        
        if (filterButtons.length === 0 || projectItems.length === 0) return;
        
        // Ativar o filtro "Todos" por padrão
        const defaultFilter = document.querySelector('.portfolio-filter[data-filter="all"]');
        if (defaultFilter) defaultFilter.classList.add('active');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                localStorage.setItem('activePortfolioFilter', filterValue);
                
                // Animação de filtro
                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    const shouldShow = filterValue === 'all' || itemCategory === filterValue;
                    
                    if (shouldShow) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Aplicar filtro salvo ao carregar
        const savedFilter = localStorage.getItem('activePortfolioFilter');
        if (savedFilter) {
            const savedButton = document.querySelector(`.portfolio-filter[data-filter="${savedFilter}"]`);
            if (savedButton) savedButton.click();
        }
    }
    initProjectFilter();
    
    // Animar elementos ao rolar
    function initScrollAnimation() {
        const animateElements = document.querySelectorAll('.fade-in, .portfolio-item, .tech-card, .experience-item');
        if (animateElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }
    initScrollAnimation();
    
    // Formulário de contato
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        // Validação em tempo real
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('invalid');
                }
            });
        });
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            const formData = new FormData(this);
            
            // Validação
            let isValid = true;
            this.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    isValid = false;
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Feedback visual
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Simular envio (substitua por chamada real)
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                // Simular resposta
                console.log('Formulário enviado:', Object.fromEntries(formData.entries()));
                
                // Feedback de sucesso
                submitButton.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                this.reset();
                
                // Mostrar mensagem de agradecimento
                const thankYouMessage = document.getElementById('thank-you-message');
                if (thankYouMessage) {
                    thankYouMessage.style.display = 'block';
                    setTimeout(() => {
                        thankYouMessage.style.display = 'none';
                    }, 5000);
                }
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                submitButton.innerHTML = '<i class="fas fa-times"></i> Erro';
            } finally {
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    }
    initContactForm();
    
    // Atualizar ano no footer
    function updateFooterYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    updateFooterYear();
    
    // Botão voltar ao topo
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;
        
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();
    }
    initBackToTop();
    
    // Inicializar tooltips
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = el.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            function positionTooltip() {
                const rect = el.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            }
            
            el.addEventListener('mouseenter', () => {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
                positionTooltip();
            });
            
            el.addEventListener('mouseleave', () => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            });
            
            window.addEventListener('resize', positionTooltip);
        });
    }
    initTooltips();
    
    // Verificar preferência por redução de movimento
    function checkReducedMotion() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReduced) {
            document.documentElement.classList.add('reduced-motion');
        }
    }
    checkReducedMotion();
});

// Carregar bibliotecas externas apenas quando necessárias
function loadExternalLibrary(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}