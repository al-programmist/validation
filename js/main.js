
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
    buttons: [],

    rules: {
        email: {
            required: true,
            pattern: /^(?!.{321})((?:\w+[.-])*\w{1,64})(@)(\w{1,255}(?:[.-]\w+)*\.\w{2,3})$/,
            minlength: 5,
            errorMessage: {
                required: 'Поле не должно быть пустым',
                pattern: 'Введите email в правильном формате. Это обязательное поле. Email не должен содержать спецсимвовов. Допустимые символы: -, ., _, @, а также строчные буквы и цифры.',
                minlength: 'Значение должно быть больше или равно 5 символам',
            }
        },
        name: {
            required: true,
            pattern: /^[A-zА-я\s\-]*$/,
            minlength: 2,
            errorMessage: {
                required: 'Поле не должно быть пустым',
                pattern: 'Введите ваше имя в нужном формате. Оно должно начинаться с большой буквы и не содержать спецсимволов',
                minlength: 'Имя должно начинаться с большой буквы и не содержать спецсимволов'
            }
        },
        agreement: {
            required: true,
            errorMessage: {
                required: 'Вы не подтвердили правильность введенных вами данных'
            }
        }
    },

    selectors: {
        validated: '.was-validated',
        success: '.is-valid',
        error: '.is-invalid',
        message: '.invalid-tooltip'
    },

    onKeyUp() {

    },

    /**
     * Получает для текущего элемента объект правил из общего объекта параметров
     * @param {*} element - DOM-элемент формы
     * @returns Объект или false
     */
    getCurrentRules(element) {
        if (element) {
            // let value = String(element.value).trim();
            let currentRule = String(element.dataset.type).trim();
            return this.rules[currentRule];
        }

        return false;
    },

    validateElement(element) {
        if (element) {
            let currentRules = this.getCurrentRules(element);
            console.log(currentRules);
        }

    },

    onChange(element) {
        element.addEventListener('change', event => {
            event.preventDefault()
            event.stopPropagation();
            this.validateElement(element);
        }, false)

    },

    onSubmit() {

    },

    /**
     * Возвращает список требуемых элементов
     * @param {*} instance - объект формы
     * @returns массив с DOM-элементами
     */
    getRequiredElements(instance) {
        return instance.form.elements;
    },

    setEvents() {
        const forms = this.elements;
        forms.forEach((instance) => {
            let elements = this.getRequiredElements(instance);
            elements.forEach((element) => {
                this.onChange(element);
            });
        });

    },

    /**
     * Заполняет входные даанные валидатора формы
     * @param {*} selector - класс формы, строка
     * @returns boolean - флаг заполненности
     */
    setFormsValidationData(selector) {
        const forms = Array.from(document.querySelectorAll(selector));
        if (forms.length) {
            this.forms = forms;

            forms.forEach((form, index) => {
                let elements = Array.from(form.querySelectorAll('[required]'));
                let submit = form.querySelector('[type="submit"]');
                let reset = Array.from(form.querySelectorAll('[type="reset"]'));
                this.elements.push({
                    'index': index,
                    'form': {
                        'elements': elements,
                        'buttons': {
                            'submit': submit,
                            'reset': reset,
                        }
                    }
                })
            });

            return true;
        }

        return false;
    },

    init(selector) {
        if (selector && typeof (selector) === 'string') {
            try {
                // Если формы для валидации определены
                if (this.setFormsValidationData(selector)) {
                    // Установить cобытия для input: focus, blur, keyup
                    // для чекбокса: состояние checked
                    // для кнопки - submit

                    this.setEvents();
                };

                // Иначе выходим из функции
                return;
            } catch (error) {
                console.log('Something went wrong', error);
            }
            return;
        }

        console.log('no forms to validate!');
    },
};

let start = Validity.init.bind(Validity);

start('.js-form-native');
