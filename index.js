const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    // Change button content based on toggle
    if (menuToggle.textContent === '☰') {
        menuToggle.textContent = '✖'; // Change to 'close' icon
    } else {
        menuToggle.textContent = '☰'; // Change back to 'hamburger' icon
    }
});
