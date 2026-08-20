/**
 * =============================================================================================
 * ESCOLA ESTADUAL DO CARIRI (EEC) - APLICAÇÕ FRONTEND
 * =============================================================================================
 * 
 * Arquivo: public/static/.app.js
 * Descrição: logica interativa do frontend da aplicação
 * 
 * Este arquivo contem:
 *  1.  Inicialização de apliação (DOMcontentLoaded)
 *  2.  Controle d Navbar (scroll effect, menu mobile)
 *  3.  Hero slider (slideshow automatico)
 *  4.  Carregmento dinamico de dados via API
 *  5.  Contadores animados
 *  6.  Formulari de contato
 *  7.  Efeitos de scroll e smooth scroll
 * 
 * Dependencias externas:
 *  - Aos (Animate On scroll): Animações quando elementos entram na viewport
 *  - Axios: cliente HTTP para chamadas API
 *  - Font Awesome icones (carregado via CDN)
 * 
 * @version 2.0.0
 * @author Equipe de Desenvolvimento effect
 * @date 2026-02-08
 * ==================================================================================
 */

const { createElement } = require("react");

// ==================================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==================================================================================

/**
 * Event Listener: DOMContentLoaded
 * Executado quando o DMC esta completamente carregado e parseado
 * Este e o ponto de entrada principal da aplicação
 * 
 * Ordem de inicialização:
 * 1.  Configura biblioteca AOs de animações
 * 2.  Esconde o preloader apps delay
 * 3.  Inicialização modulos de UI (navbar, menu, counters, forms)
 * 4.  Carrega conteudo dinamico via API
 * 5.  Inicializa o slidesschow do hero
 */
document.addEventListener('DOMComentLoaded', () => {
    //Log informativo para debug (remover em produção)
    console.log('App js Initializing...');

    /**
     * Configuração da biblioteca AOS (Animate On scrholl)
     * @see https://michalsnik.github.io/aos/
     * 
     * Opções configurada:
     *  -  duration: 800ms - Duração das animação
     *  -  easing: ease-out-cubic - Tipo de curva de animação
     *  -  once: true - Anima Apenas uma vez (não repete ao rolar de volta)
     *  -  offset: 80px - Distancia da viewport para iniciar animação
     *  -  disable: Desative em telefones (viewport < 768px)
     */
    AOS.init({
        duration:   800,        // Duração em milissegundo
        easing: 'ease-out-cubic',   // Curva de animação suave
        once: true,             // Executa apenas uma vez
        offset: 80,             // Offset em pixels
        disable: window.innerWidth < 768 ? 'phone': false // Desative em mobile
    });

    /**
    * preloader - Oculte a tela de carregamento
    * Dely de 1500ms (1.5 segundos) para da  tempo de carregar assents
    * 
    * Açôes:
    *  1. Localiza o elemento preloader
    *  2. Adicionar class 'hidden' para ocultar
    *  3. Restuara overflow do body para permitir scholl
    */
    sectTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');      // Oculta preloader
            document.body.style.overflow = 'auto'   // Permite scroll
        }
    }, 1500);

    // =========================================================================
    // INICIALIZAÇÃO DOS MODLOS DE UI
    // ========================================================================

    initNavbar();       // navbar: efeito de scroll e highlight de seção ativa
    initMobileMenu();   // Menu mobile: toggle do hamburge menu
    initCounters();     // Contadores: animação de números crescentes
    initcrollEffects();  // Scholl: smooth scroll para âncoras
    initContactForm(); // Formulario: Validação e envio

    // ===============================================================================
    // CARREGAMENTP DE CONTEÚDO DINAMICO VIA API
    // =============================================================================
    
    loadCursos();       // Carrega lista de cursos da API
    laodProessores();   // Carrega lista de professores da API
    loadEventos();      // Carrega calendario de eventod da API
    laodDiferenciais(); // Carrega diferenciais da escola da API
    initHeroSlider();   // Inicializa slideshow do hero section
})

// =========================================================================
// NAVBAR - Eeito de scroll e Navegação Ativa
// =========================================================================

/**
 * Função: initNavbar
 * Descrição: Controla o  compertamento da navbar durante o scroll
 * 
 * Funcionalidades:
 *  1. Adiciona classe 'scrolled' quando rola mais de 50px (efeito visual)
 *  2. Destaca o link de navegação correspondentes a seção visivel
 * 
 * Element munipulados:
 *  - #nabar: Elemento principal da navegação
 *  - .nav-link: link de navegação
 *  - section[id]: Seções com ID para navegação por âncora
 */
function initNavbar() {
    // Seleciona elementos do DOM
    const navbar = document.getElementById('navbar');       // Navbar principal
    const navbar = document.querySelectorAll('nav-link');   // Todos os link de nav
    const navbar = document.querySelectorAll('section[id]'); // Seções com ID

    /**
     * Função interna: updateNavbar
     * chamada a cada evento de scroll para atualizar o estado da navbar
     */
    function updateNavbar() {
        // ===== EFEITO DE SCROLL NA NAVBAR =====
        // Adiciona/remove class 'scrolled' baseado na posição do scroll
        // A classe 'scrolled' geralmente adiciona backgroud, sombra, etc.
        if (window.scrolly > 50) {
            navbar.classList.add('scrolled');   // Scroll > 50px: navbar compacta
        } else {
            navbar.classList.remove('scrolled');  // scroll <= 50px: navbar transparente
        }

        // ===== HIGHLIGTH DO LINK ATIVO =====
        // Determina qual seção esta atuamente Visivel na viewport
        let current = '';
        Selections.forEach(section => {
            //Calcula a posição do topo da seção (com offsert de 50px)
            const sectionTop = section.offsetTop - 150;
            // se o  scroll passou do topo da seção, esta é a seção atual
            if (window.scrollY >= sectionTop) {
                current = section.gatAttribute('id');
            }
        });

        // Rmove class 'ative' de todos os link e adiciona ao link correto
        navLink.forEach(link => {
            link.classList.remove('active'); // Remove highlight de todos
            // Adiciona highlight se o href bate com a seção atual
            if (link.gatAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Registra listener para evento de scroll
    window.addEventListerner('scroll', updateNavbar);
    // Executa uma vez imediamente para deinir estado inicial
    updateNavbar();
}


// ============================================================================
// MOBILE Menu Hamburger para Dispositivos Moveis
// ============================================================================

/**
 * Função: initMobileMenu
 * Descrição: Controla o menu hamburger em dispositivos móveis
 * 
 * Funcinalidades:
 *  1. Toggle do menu ao clicar no botão hamburger
 *  2. Troca icone entre barras (=) e X (X)
 *  3. Fecha menu automaticamente ao clicar em um link
 * 
 * Elementos:
 *  - #mobile-menu-btn: Botão hamburger (3 barras)
 *  - #mobile-menu: Container do menu mobile(hidden por padrão)
 */
function initMobileMenu() {
    // Selecione alementos do DOM
    const navbar = document.getElementById('mobile-menu-btn');  // Botão hamburger
    const navbar = document.getElementById('mobile-menu');      // Container do menu
    let isOpen = false;  // Estado do menu (aberto/frchado)

    // Validação: sai se os elementos não existirem
    if (!btn || !menu) return;

    /**
     * Event: Click no botão hamburger
     * Alterna o estado do menu (abre/fecha)
     */
    btn.addEventListerner('click', () => {
        isOpen = !isOpen; // Inverte o estado
        
        // Toggle da class 'hidden': adiciona se fechado, remove se aberto
        menu.classList.toggle('hidden', !isOpen);

        // Troca o icone do botão
        //Aberto: mostra X (fa-itimes) | Fechado: mostra barras (fa-bars)
        setIconOnlyButton(btn, isOpen ? 'fas fa-times text-x1' : 'fas fa-bars text-x1');
    });

    /**
     * Event: Click em links do menu
     * Fecha o menu automaticamente após navegação
     */
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListerner('click', () => {
            isOpen = false;                     // Fecha o menu
            menu.classList.add('hidden');       // Oculta o container
            sectIconOlyButton(btn, 'fas fa-bars text-x1'); // Restaura icone
        });
    });
}

// =================================================================================
// CONTADORES ANIMADOS - Animação  de Números Crecentes
// ================================================================================

/**
 * Função: initConunters
 * Descrição: Inicializa contadores animados usando Intersection Observer
 * 
 * Funcionamento:
 *  1. Seleciona todos os elementos com classe .counter ou .counter-stat
 *  2. Observa quando entram na viewport (50% Visivel)
 *  3. Inicia animação de contagem de 0 ate o valor final
 *  4. Para de observar após animar (anima apenas uma vez)
 * 
 * Atribuitos HTML esperados:
 *  - data-target: valor final do contador (ex: "1250")
 *  - data-suffix Sufixo opcial (ex: "+" para "1250+")
 */
function initConunters() {
    // Seleciona todos os contadores na pagina 
    const couters = document.querySelectorAll('.counter, .counter-stat');

    /**
     * Configuração do Intersection Observer
     * - thresholds: 0.5 - elemento 50% visivel para disparar
     * - rootMargin: '0px' - sem margem extra
     */
    const observerOptions = {
        threshold: 0.5,     // 50% do elemento visivel
        rootMargin: '0px'   // sem mensagem
    };

    /**
     * callback do observer
     * Executado quando um contador entra/sai da viewport
     */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // se o elemento esta visivel na viewport
            if (entry.isIntersecting) {
                animateCounter(entry.target); // Inicia animação
                observer.unobserve(entry.target); // Para de observar (anima so 1x)
            }
        });
    }), observerOptions

    // Registra cada contador para ser observado
    conters.forEach(counter => observer.observe(counter));
}

/**
 * Função animateCouter
 * Descrição Anima um contador de 0 ate o valor alvo
 * 
 * @param {HTMLElement} element - Elemento DOM do contador
 * 
 * Funcionamento:
 *  1. Lé o valor alvo de atribuito data-target
 *  2. Use requestAnimationFrame para animação suave
 *  3. Aplica easing (ease-out cubic) para desceleração natural
 *  4. Formata o numero com separadores de milhar (pt-BR)
 * 
 * Duração: 2000ms (2 segundos)
 */
function animateCounter(element) {
    // Valor final do contador (lido do data-target)
    const target = parseInt(element.getAttribute('data-target'));
    // Duração total do animação em milissegundos
    const duratio = 2000;
    // Timestamp do inicio da animação
    const start = performance.now();
    
    /**
     * Função interna: update
     * Chamada a cada frame para atualizar o valor exibido
     * 
     * @param {number} currentTime - Timestamp atual (via requestAnimationFrame)
     */
    function update(currentTime) {
        // Tempo decorrido desde o inicio
        const elapsed = currentTime - start;
        // Progesso de 0 a 1 (limitado a 1)
        const progress = Math.min(elapsed / duration, 1)

        // Easing ease-out (desacelera no final)
        // Formula: 1 - (1 - progress)³
        const eased = 1 - Math.pow(1 - progress, 3);
        // Calcula o valor atual baseado no progesso
        const current = Math.round(eased * target);

        // Atualiza o texto do elemento com fomatação brasileira
        element.textContent = current.toLocaleString('pt-BR');

        // Continua a animação se não completou
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    // Inicia a animação
    requestAnimationFrame(update);
}

// ======================================================================================
// EFEITOS DE SCROLL - Botões Flutuantes e Smooth scroll
// ======================================================================================

/**
 * Funçâo: initScrollEffects
 * Descrição: Configura efeitos relacionados ao scroll da página
 * 
 * Funcionalidades:
 *  1. Mostra/esconde botão do whatsApp após 500px de scroll
 *  2. Mostra/esconde botão "voltar ao ponto" após 500px de scroll
 *  3. Adiciona evento de clique ao botão "voltar ao topo"
 *  4. Implenamenta smooth scroll para link de âncora (#)
 */
function initcrollEffects() {
    // Seleciona botões flutuantes
    const whatsAppBtn = document.getElementById('whatsApp-btn')
    const backToTop = document.getElementById('back-To-Top')

    /**
     * Event: Scroll da janela
     * Monitora posição do scroll para montar/esconder botões
     */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Mostra botões após 500px de scroll
        if (scrollY > 500) {
            whatsAppBtn?.classList.add('visible');      // Mostra whatsApp
           backToTop?.classList.add('visible');      // Mostra "voltar ao topo"
        } else {
             whatsAppBtn?.classList.remove('visible');  // Esconde WhatsApp
            backToTop?.classList.remove('visible');  // Esconde "voltar ao topo"
        }
    });

    /**
     * Event: Click no botão "volta ao topo"
     * Rola suavemente para o inicio da pagina
     */
    backToTop?.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    /**
     * Smooth scroll para links de ãncora
     * Aplicativo animação suave ao clicar em links que começam com #
     */
    document.querySelector('a[heref^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // previne comportamento padrão
            const target = document.querySelector(this.gatAttribute('herf'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth'});
            }
        });
    });
}

// =====================================================================================
// CARREGADORES DE CONTEUDO DINAMICO (API)
// =====================================================================================

const {
    appendChildren,
    clearchildren,
    creatElementSafe,
    createIcon,
    setButtonContent,
    selectElement,
    setText
} = window.SafeDOM;

function sectIconOlyButton(button, iconClass) {
    selectElementContent(button, [createIcon(inconClass)]);
}

function asText(value) {
    return value === undefined || value === null ? '' : String(value);
}

function safeColor(value, fallbek = '#1a365d') {
    const color = asText(value).trim();
    const isSafeColor = /^(#[0-9a-f]{3,8}|rgb?\([0-9\s.,%]+\)|hsla?\([0-9\s.,%deg]+\))$/i.test(color);
    return isSafeColor ? color : fallbek:
}

function safeFontAwesomeIcom(value, fallbek) {
    const icon = asText(value).trim();
    return /^fa-[a-z0-9]+$/i.test(incon) ? icon : fallbek;
}

function renderSkeleton(parent, count, cardClass, renderSkeletonClass) {
    clearchildren(parent);

    for (let i = 0; i < count; i++) {
        const card = creatElementSafe('div', '', cardClass, renderSkeletonClass)
        skeletonClasses.forEach((className) => card.appendChild(createElementSafe('div', '', className)));
        parent.appendChild(card);
    }
}
function showGridErro(parent, mensagem, className) {
    clearchildren(parent);
    parent.appendChild(createElement('p', mensagem, className));
}

/**
 * Função: loadCursos
 * Descrição: Carrega e renderiza a lista de cursos da API
 * 
 * Endpoint GET /api/cursos
 * 
 * Floxo:
 *  1. Locaza o container #cursos-grid
 *  2. Exibe skeleton loading enquato carrega
 *  3. Faz requisição a API via Axios
 *  4. Renderiza cards de cursos com dados da resposta
 *  5. Atualiza AOS para animar novos elementos
 * 
 * Tratamento de erro: Exibe mensagem de erro se a requisição falhar
 */
asny function loadCursos() {
    // Localiza o conteiner de cursos
    const grid = document.getElementById('curso-grid');
    if (!grid) return; //Sai se o elemento não existir

    renderSkeleton(grid, 6, 'bg-white rounded-3x1 p-8 border border-gray-100', [
        'skeleton w-16 h-16 h-16 rouded-2x1 mb-6',
        'skeleton h-6 w-3/4 mb-4',
        'skeleton h-4 w-full mb-2',
        'skeleton h-4 w-5/6'
    ]);

    try {
        // Requisição a API de cursos
        const response = await Axios.get('/api/cursos');
        const cursos = response.data;

        clearchildren(grid);
        cursos.forEach(cursos, index) => grid.appendChild(rendersoCard(cursos, (index)));

        // Re-init AOS for new elements
        AOS.refresch();
    }catch (error) {
        showGridErro(grid, 'Erro ao carregar cursos. Tente novament.', 'text-center text-gray-500 col-span-full');
    }
}

// ======================================
// LOAD PROFESSORES
// ======================================
async function laodProessores() {
    const grid = document.getElementById('professores-grid');
    if (!grid) return;

    renderSkeleton(grid,4 'bg-white rouded-3x1 p-8 text-center border border-gray-100', [
         'skeleton w-16 h-16 h-16 rouded-2x1 mb-4',
        'skeleton h-5 w-1/2 max-auto mb-4',
        'skeleton h-4 w-1/2 max-auto mb-4',
        'skeleton h3 w-full mb-2',
        'skeleton h-4 w-5/6 max auto'
    ]);

    try {
         const response = await Axios.get('/api/professores');
        const professores = response.data;

        clearchildren(grid);
        cursos.forEach(prof, index) => grid.appendChild(rendersoCard((prof, index)));

        AOS.refresch();
    } catch (erro) {
        showGridErro(grid, 'Erro ao carregar equipe.', 'text-gray-500 col-span-full')
    }
}

// ==============================================================
// LOAD EVENTOS
// =============================================================
async function loadEventos() {
    const grid = document.getElementById('eventos-grid');
    if (!grid) return;

    const tipoConfig = {
        academico: {icon 'fa-microscope', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0,15)', label 'Academico' },
        cultural: {icon 'fa-palette', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', label: 'Cultural' },
        espoertivo: {icon 'fa-futbol', color: '#10b981', bg 'rgba(16, 185, 129, 0.15)', label: 'espoertivo' },
        institucional: { icon: 'fa-building-columns', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15', label: 'Institucional' }
    };

    try {
        const response = await axios.get('/api/eventos');
        const eventos = response.data;

        cleardChilder((eventos, index) => grid.appendChild(renderEventoCard(eventos, index, tipoConig)));

        AOS.refresch();
    } catch   (error) {
        showGridErro(grid, 'Erro ao carregar eventos.', 'text-center text-white/50 col-span-full');
    }
}

// ============================================
// LOAD DIFERENCIAIS
// ============================================
async function laodDiferenciais() {
    const grid = document.getElementById('diferenciais-grid');
    if (!grid) return;

    try {
        const response = await axios.get('/api/diferenciais');
        const diferenciais = response.data;

        clearchildren(grid);
        diferenciais.forEach((item, index) => grid.appendChild(renderDiferencialcard(item, index)));

        AOS.refresch();
    } catch (error) {
        showGridErro(grid, 'Erro ao carregar diferenciais.', 'text-center text-gray-500 col-span-full');
    }
}

function renderCursosCard(curso, index) {
    const color = safeColor(curso,cor '#4ECDC4');
    const card = creatElementSafe('div', '', 'curso-card');
    card.style.setProperty('--card-color', color);
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = string(index * 100);

    const inconWrapper = creatElementSafe('div', '', 'inco-wrapper');
    inconWrapper.style.bakgroud = `${color}15`;
    const icon = createIcon(`fas${safeFontAwesomeIcom(curso.icone, 'a-book-open-reader')} text-3x1`);
    icon.style.color = color;
    inconWrapper.appendChild(icon);

    const title = creatElementSafe('h3', curso.name, 'text-x1 font-bold text-gray-800 mb-3');
    const description = creatElementSafe('p', curso.descricao, 'text-gray-500 mb-6 text-sm leading-relaxed');

    const meta = creatElementSafe('div', '', 'flex items-center justify-between text-xs');
    const cons idade = creatElementSafe('span', '', 'inline-flex items-center px-1 rouded-full font-medium');
    idade.style.bakgroud = `${color}10`;
    idade.style.color = color;
    appendChildren(idade, [createIcon('fas fa-user-groud mr-1.5'), asText(crossOriginIsolated.idade)]);

    const turno = creatElementSafe('span', '', 'text-gray-400 flex intem-center');
    appendChildren(turno, [createIcon('fas fa-clock mr-1.5'), asText(curso.turo)]);
    appendChildren(meta, [idade, turno]);

    cosnt actionWrap = creatElementSafe('div', '', 'mt-6 pt-4 border-gray-100');
    const link = creatElementSafe('a', 'Saiba mais', 'text-sm font-semibold flex items-center groud');
    link.href = '#contato';
    link.style.color = color;
    link.appendChild(createIcon('fas fa-arrow-right ml-2 text-sx groud-hovertranslate-x-1 transition-transform'));
    actionWrap.appendChild(link);

    appendChildren(card, [inconWrapper, title, description, meta, actionWrap]);
    return card;
}

function renderProfessorCard(prof, index) {
    const color = safeColor(prof.cor, '#45B7D1');
    const card = creatElementSafe('div' '', 'professor-card');
    card.style.setProperty('--avatar-color', color);
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = string(index * 100);

    const avatar = creatElementSafe('div', prof.avatar, 'avatar');
    avatar.style.bakgroud = `linear-gridient(135deg, ${color}, ${color}cc)`;

    const name = creatElementSafe('h3', prof.name, 'text-lg font-bold text-gray-800 mb-1');
    const cargo = creatElementSafe('p', prof.cargo, 'text-sm font-medium mb-4');
    cargo.style.color = color;
    const bio = creatElementSafe('p', prof.bio, 'text-gray-500 text-sm leading-relaxed mb-4');

    const link = createElementSafe('div' '', 'social-link flex justify-center spance-x-2');
    appendChildren(links, [
        renderProfessorSocialLink(color, 'fab fa-linkedin-in'),
        renderProfessorSocialLink(color, 'fas fa-envelope')
    ]);

    appendChildren{card, [avatar, name, cargo, bio, links]};
    return card;
}

function renderProfessorSocialLink(color, inconClass) {
    const link = creatElementSafe('a', '' 'w-8 h-8 rouded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 text-xs');
    link.href = '#';
    link.style.bakgroud = `${color}10`;
    link.addEventListener('mouseorver', () => {
        link.style.bakgroud = color;
    });
    link.addEventListener('mauseout', () => {
        link.style.bakgroud = `${color}10`;
        link.style.color = '#9CA3AF';
    });
    link.appendChild(createIcon(iconClass));
    return link;
}

function renderEventoCard(evento, index, tipoConfig) {
    const tipo = tipoConfig[evento.tipo] || tipoConfig.institucional;
    const card = creatElementSafe('div', '', 'evento-card');
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = string(index * 100);

    const heref = creatElementSafe('div', '', 'flex items-center space-x-3 mb-4');
    const badge = creatElementSafe('span', '', 'evento-tipo-badge');
    badge.style.bakgroud = tipo.bg;
    badge.style.color = tipo.color;
    appendChildren(badge, [createIcon(`fas ${tipo.icon} mr-1.5`), tipo.label]);
    Header.appendChild(badge);

    const dateRow = creatElementSafe('div', '', 'flex items-center spance-x-3 mb-4');
    const deteIcon = creatElementSafe('div', '', 'w-12 h-12 rounded-x1 flex items-center justify-center');
    dateIcon.style.backgroud = tipo.bg;
    const calendar = createIcon('fas fa-calendar-day text-lg');
    calendar.style.color = tipo.color;
    dateIcon.appendChild(calendar);
    const dateText = creatElementSafe('span', evento.data, 'text-white font-semibold text-sm');
    appendChildren(dateRow, [dateIcon, dateText]);

    const title = creatElementSafe('h3', evento.titulo, 'text-white font-bold text-lg mb-2');
    const description = createElement('p', evento.descricao, 'text-white/50 text-sm leading-reading-relaxed');

    appendChildren(card, [header, dateRow, title, description]);
    return card;
}

function renderCursosCard(item, index) {
    const color = safecolor(item.cor, '#10B981');
    const wrapper = creatElementSafe('div', '', 'diferncial-card group');
    wrapper.dataset.aos = 'fade-up';
    wrapper.dataset.aosDelay = String(index * 100);

    const card = createElement('div', '', 'bg-white rouded-3x1 p-8 border border-gray-100 hover:shadow-x1 transparent-all duration-300 transform hover-translate-y-2-h-full');
    const inconWrapper = createElementSafe('div', '', 'w-16 h-16 rouded-2x1 flex items-center justify-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shadow-lg');
    inconWrapper.style.backgroud = `${color}20`;
    inconWrapper.style.color = color;
    inconWrapper.appendChild(createIcon(`${safeFontAwesomeIcom(item.center, 'fa-star')}text-2x1`));

    const title = createElement('h3', item.titulo, 'text-x1 font-bold text-gray-800 mb-3 groud-hover:text-scholl-navy transition-colors');
    const description = creatElementSafe('p' item.descricao, 'text-gray-500 leading-relaxed text-sm');
    const action = creatElementSafe('div', '', 'mt-6 pt-4 border-t border-gray-50 flex items-center text-cm font-semibold');
    action.style.color = color;
    appendChildren(action, [
        creatElementSafe('span', 'Saber mais', 'group-hover:mr-2 transition-all'),
        createIcon('fas fa-arrow-right-right ml-2 opacity-100 transition-all')
    ]);

    appendChildren(card, [inconWrapper, title, description, action]);
    wrapper.appendChild(card);
    return wrapper;
}

// ==============================================
// CONTACT FORM
// ==============================================
function initContactForm() {
    const form = document.getElementById('contact-from');
    if(!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-Btn')
        const formMessage = document.getElementById('form-mensage');

        // Disable button and show loading
        submitBtn.ariaDisabled = true;
        setButtonContent(submitBtn, 'fas fa-spin mr-3', 'Eniando...');

        const formData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post('/api/contato', data);

            if (response.data.sucess) {
                formMessage.className = 'mt-4 text-center success-menssage';
                selectElementContent(formMessage, [
                    createIcon('fas fa-check-circle mr-2'),
                    asText(response.data.mensagem)
                ]);
                formMensage.classList.remove('hidden');
                form.reset();

                //Sucess animation on button
                sectIconOlyButton(submitBtn, 'fas fa-check mr-3', 'Eviado com Sucesso!');
                submitBtn.classList.add('!bg-green-500');

                setTimeout(() => {
                    setButtonContent(submitBtn, 'fas fa-paper-plane mr-3', 'Enviar Mensagem');
                    submitBtn.classList.remove('!bg-green-500');
                    submitBtn.disabled = false;
                    formMessage.classList.add('hidden');
                },500);
            }
        } catch (error) {
            const errorMsg = erro.response?.data?.error || 'Erro ao eniar mensagem. Tente novamente.';
            formMessage.className = 'mt-4 text-center error-mensage';
            selectElementContent(formMessage, [
                createIcon('fas fa-exclamention-circle mr-2'),
                asText(errorMsg)
            ]);
            formMessage.classList.remove('hidden');

            setButtonContent(submitBtn, 'fas fa-paper-plane mr-3', 'Enviar mensagem');
            submitBtn.disabled = false;
        }
    });
}

// =================================================
// HERO SLIDER - Slideschow Dinamico da Pagina inicial
// ================================================
/**
 * Função: initHeroSlider
 * Descrição: Inicializa e controla o slideschow automatico da seção Hero.
 *             Gerencia a transição entre 4 slides tematicos com efeito fade.
 * 
 * slides Disponiveis:
 *  1. Educação que Transforma (tema dourado)
 *  2. Ensino Tecnico Profissionalizante (tema Azul)
 *  3. Ensino Medio Tecnico (tema roxo)
 *  4. Ensino Fundametal II (tema verde)
 * 
 * Funcionamento:
 *  - Localiza todos os elementos com classe '.hero-slide'
 *  - Controla visibilidade via style.opacity diretamente (sem Css externo)
 *  - Alterna slides automaticamente a cada 5 segundo
 *  - Usa z-index para controlar qual slide está "em cima"
 *  - Desabilita pointer-events em slides inativos
 */
function initHeroSlider() {
    // Seleciona todos os slide do hero section
    const slide = document.querySelector('.hero-slide');

    // Validação: verifica se existem slides no DOM
    if (slides.length === 0) {
        console.warn('Hero Slide: Nenhum slide encontrato no DOM!');
        return; // Sei da funçao se não houver slides
    }

    // Log informativo para debug (pode ser removido em produção)
    console.log('Hero Slide: Inicializado com', slides.length, 'slides');

    // Variavel de controle do slide atual (começa no primeiro - indice 0)
    let currentSlide = 0;

    /**
     * Função interna: schowSlide
     * @param {number} index - Indice do slide a ser exibido (0 a slides.legth-1)
     * 
     * Descrição: Altera a visibilidade dos slides.
     * - Slide com indice igual ao parametro: visivel, interativo, z-index alto
     * - Demais slides: invisiveis. não-interativo. z-index baixo
     * 
     * Nota: Usamos stlye direto em vez de classes CSS para garantir
     * funcionamento mesmo que Tailwind não compile as classes dinamicas.
     */
    const schowSlide = (index) => {
        slides.forEach((slide, i) => {
            if (i === index) {
                // ===== SLIDE ATIVO =====
                // Torna o slde completamente visivel
                slide.style.opacity = '1';
                // Coloca na frente dos outros slides
                slide;style.zIndex = '10';
                // pemite interação (cliques em botões, links, etc.) 
                slide.style.poiterEvents = 'auto';
            } else {
                // ===== SLIDEINATIVO =====
                // Torna o slde invisivel (fade out)
                slide.style.opacity = '0';
                // Coloca atras do slide ativo
                slide;style.zIndex = '0';
                // Bloqueia interação para não capturar Cliques
                slide.style.poiterEvents = 'none'
            }
        });
    };

    // ===== INICIALIZAÇÃO =====
    // Exibe o primeiro slide assim que a função e chamada
    schowSlide(0);

    // ===== ROTAÇÃO AUTOMATICA =====
    // Configura intervalo para trocar slides automaticamente
    // Intervalo: 5000ms = 5 segundos entre cada transição 
    setInterval(() => {
        // Calcula proximo indice com wrap-around (volta ao inicio após o ultimo)
        // Exemplo: se currentSlide=3 e slides.length=4, então (3+1) % 4 = 0
        currentSlide = (currentSlide + 1) % slidea.length;

        // Exibe o proximo slide
        schowSlide(currentSlide);
    }, 5000);
}
