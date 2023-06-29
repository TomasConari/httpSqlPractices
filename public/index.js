
const url = window.location.href
console.log(url)


let btn = document.querySelector('.btn');

btn.addEventListener('click', () => {
    window.location.href = url + 'product'
})
