let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Quando o usuário desce, o cabeçalho sobe
        header.style.transform = 'translateY(-100%)';
    } else {
        // Quando o usuário sobe, o cabeçalho desce
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita o valor negativo para lastScrollTop
});

// Hamburger Menu
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".navbar");

    hamburger.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
});