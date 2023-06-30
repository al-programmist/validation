// Валидация средствами Bootstrap
(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation');
    let setState = (form) => {
        const inputs = form.querySelectorAll('.js-control-input');
        console.log(inputs);
    }

    Array.from(forms).forEach(form => {
        setState(form);
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()