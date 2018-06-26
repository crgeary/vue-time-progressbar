var app = new Vue({
    el: '#app',
    data: {
        minutes: 60,
        name: ''
    }
});

function changeColor(e) {
    document.documentElement.style.setProperty(`--primary-color-hue`, document.querySelector('input[type=range]').value);
}