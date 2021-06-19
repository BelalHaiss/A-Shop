const mdScreen = document.querySelector('.md-screen');
const toggoleNav = () => {
    mdScreen.classList.toggle('show-me');
};
const a = document
    .querySelector('.toggole')
    .addEventListener('click', toggoleNav);
