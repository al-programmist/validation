
/**
 * Валидация средствами Bootstrap
 */
(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})();


const Validity = {
    forms: [],
    elements: [],
    rules: {
        email: {
            pattern: /^(?!.{321})((?:\w+[.-])*\w{1,64})(@)(\w{1,255}(?:[.-]\w+)*\.\w{2,3})$/,
            minlength: 5,
            errorMessage: {
                selector: '.invalid-tooltip',
                pattern: 'Введите email в правильном формате. Это обязательное поле. Email не должен содержать спецсимвовов. Допустимые символы: -, ., _, @, а также строчные буквы и цифры.',
                minlength: 'Поле не должно быть пустым',
            }
        },
        name: {
            pattern: /^[A-Za-zА-я\s\-]*$/,
            minlength: 2,
            errorMessage: {
                pattern: 'Введите ваше имя в нужном формате. Оно должно начинаться с большой буквы и не содержать спецсимволов',
                minlength: 'Имя не должно быть пустым. Это обязательное поле. Оно должно начинаться с большой буквы и не содержать спецсимволов'
            }
        }
    },

    selectors: {
        validated: '.was-validated',
        success: '.is-valid',
        error: '.is-invalid',
        message: '.invalid-tooltip'
    },

    setFormsValidation(selector) {
        const forms = Array.from(document.querySelectorAll(selector));
        if (forms.length) {
            this.forms = forms;

            forms.forEach((form, index) => {
                let elements = Array.from(form.querySelectorAll('[required]'));
                this.elements.push({
                    index : elements
                })
            });
        }
    },

    init(selector) {
        if (selector && typeof (selector) === 'string') {
            this.setFormsValidation(selector);
            return;
        }
        console.log('no forms to validate!');
    },
};

let start = Validity.init.bind(Validity);

start('.js-form-native');
