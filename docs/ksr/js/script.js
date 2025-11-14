document.addEventListener('DOMContentLoaded', function() {
    // 初始化 AOS 动画库
    AOS.init({
        duration: 1000,
        once: true
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // 视差滚动效果
    const parallaxImage = document.querySelector('[data-scroll-parallax]');
    let ticking = false;

    function updateParallax(scrollPos) {
        if (!parallaxImage) return;

        const elementTop = parallaxImage.getBoundingClientRect().top;
        const elementHeight = parallaxImage.offsetHeight;
        const windowHeight = window.innerHeight;
        
        const scrollPercentage = (windowHeight - elementTop) / (windowHeight + elementHeight);
        
        if (scrollPercentage >= 0 && scrollPercentage <= 1) {
            const scale = 1 + (scrollPercentage * 0.2);
            
            parallaxImage.style.transform = `scale(${scale})`;
        }
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax(window.pageYOffset);
                ticking = false;
            });
            ticking = true;
        }
    });

    // 初始化时也要运行一次
    updateParallax(window.pageYOffset);

    // 确保页面加载时图片透明度为1
    if (parallaxImage) {
        parallaxImage.style.opacity = 1;
    }

    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // 点击菜单项后自动关闭菜单
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // 将箭头添加到hero部分
    const hero = document.querySelector('.hero');
    const scrollArrow = document.querySelector('.scroll-to-top');
    
    // 点击箭头滚动到下一个section
    scrollArrow.addEventListener('click', () => {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // 更新页脚版权年份
    const footerCopyright = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    footerCopyright.innerHTML = `© 2024-${currentYear} | uSDX 开源项目 | <a href="https://forum.hamcq.cn/d/2905" target="_blank">@Syryia</a>`;

    // 返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    
    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // 点击返回顶部
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // FAQ 交互
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // 关闭其他打开的问题
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // 如果当前问题未打开，则打开它
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // 灯箱功能
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const schematicImages = document.querySelectorAll('.schematic-image');

    // 点击图片打开灯箱
    schematicImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    // 点击关闭按钮或灯箱背景关闭灯箱
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // 恢复背景滚动
        }
    });

    // ESC键关闭灯箱
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}); 