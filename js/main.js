
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

    //ВНИМАНИЕ! От очередности свойств этого объекта зависит очередность проверки полей. По умолчанию принято так: проверка на заполнение, минимальную длину, максимальную длину, паттерн.
    rules: {
        email: {
            required: true,
            minlength: 5,
            maxlength: 50,
            pattern: /^(?!.{321})((?:\w+[.-])*\w{1,64})(@)(\w{1,255}(?:[.-]\w+)*\.\w{2,3})$/,
            errorMessage: {
                required: 'Поле не должно быть пустым',
                pattern: 'Введите email в правильном формате. Это обязательное поле. Email не должен содержать спецсимвовов. Допустимые символы: -, ., _, @, а также строчные буквы и цифры.',
                minlength: 'Значение должно быть больше или равно 5 символам',
                maxlength: 'Максимальная длина - не более 50 символов',
            }
        },
        name: {
            required: true,
            minlength: 2,
            maxlength: 50,
            pattern: /^[A-zА-я\s\-]*$/,
            errorMessage: {
                required: 'Поле не должно быть пустым',
                pattern: 'Введите ваше имя в нужном формате. Оно должно начинаться с большой буквы и не содержать спецсимволов',
                minlength: `Минимальная длина - не менее 2 символов`,
                maxlength: 'Максимальная длина - не более 50 символов',
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
        success: '.is-valid',
        error: '.is-invalid',
        message: '.invalid-tooltip'
    },

    onKeyUp(element, instance) {
        const form = element.closest('.form');
        element.addEventListener('keyup', event => {
            if (form.classList.contains('form-error')) {

                this.validateElement(element);
                this.checkForm(element, instance);
            }
        }, false)
    },

    /**
     * Получает для текущего элемента объект правил из общего объекта параметров
     * @param {*} element - DOM-элемент формы
     * @returns Объект или false
     */
    getCurrentRules(element) {
        if (element) {
            let currentRule = String(element.dataset.type).trim();
            return this.rules[currentRule];
        }

        return false;
    },

    /**
     * Вытаскивает текущее сообщение об ошибке
     * @param {*} rule - правило, строка
     * @param {*} element  - DOM-элемент формы
     * @returns Строка
     */
    getCurrentErrorMessage(rule, element) {
        const errorMessages = this.getCurrentRules(element)['errorMessage'];
        return errorMessages[rule];
    },


    /**
     * Валидация Native Javascript
     * @param {*} element - DOM-элемент формы
     * @returns - Объект или true
     */
    isValid(element) {
        if (element) {
            let currentRules = this.getCurrentRules(element);
            let value = String(element.value).trim();
            let ruleValue;
            let currentErrorMessage;
            let currentType = String(element.attributes.type.value);
            for (let rule in currentRules) {
                if (rule !== 'errorMessage') {
                    ruleValue = currentRules[rule];
                    currentErrorMessage = this.getCurrentErrorMessage(rule, element);
                    if (rule === 'required') {
                        if ((currentType === 'checkbox' || currentType === 'radio') && !element.checked) {
                            return {
                                'result': false,
                                'error': currentErrorMessage,
                            }
                        }

                        if (!value.length)
                            return {
                                'result': false,
                                'error': currentErrorMessage,
                            }
                    } else

                        if (rule === 'minlength' && (value.length < ruleValue)) {
                            return {
                                'result': false,
                                'rule': rule,
                                'error': currentErrorMessage,
                            }
                        } else

                            if (rule === 'maxlength' && (value.length > ruleValue)) {
                                return {
                                    'result': false,
                                    'rule': rule,
                                    'error': currentErrorMessage,
                                }
                            }
                            else
                                if (rule === 'pattern' && (!ruleValue.test(value))) {
                                    return {
                                        'result': false,
                                        'rule': rule,
                                        'error': currentErrorMessage,
                                    }
                                };

                }
            }

            return true;
        }

    },

    /**
     * Устанавливает состояние элемента на форме
     * @param {*} element - DOM-элемент
     * @returns 
     */
    validateElement(element) {
        let isValid = this.isValid(element);
        const errorSelectorMessage = element.closest('.control').querySelector(this.selectors.message);

        if (typeof (isValid) !== 'boolean') {
            element.classList.add('is-invalid');
            element.classList.remove('is-valid');
            errorSelectorMessage.textContent = isValid.error;
            return false;
        }

        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
        errorSelectorMessage.textContent = "";
        return true;
    },

    checkForm(element, instance) {
        // Сколько требуется - столько должно быть валидными
        const form = element.closest('.form');
        let required = this.getRequiredElements(instance).length;
        let validElements = form.querySelectorAll('.is-valid').length;
        let button = this.getFormButton(instance);

        if (required === validElements) {
            form.classList.add('form-valid');
            form.classList.remove('form-error');
            button.removeAttribute('disabled');
            return true;
        }
        
        form.classList.add('form-error');
        form.classList.remove('form-valid');
        button.setAttribute('disabled', true);
        return false;
    },

    onChange(element, instance) {
        element.addEventListener('change', event => {
            event.preventDefault();
            event.stopPropagation();
            this.validateElement(element);
            this.checkForm(element, instance);
        }, false)
    },

    onSubmit(button, instance) {
        const form = button.closest('.form');
        const required = this.getRequiredElements(instance);
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();

            if (!form.classList.contains('form-valid')) {
                required.forEach((element) => {
                    if (!element.classList.contains('is-valid')) {
                        element.classList.add('is-invalid')
                    }
                });
    
                button.setAttribute('disabled', true);
                form.classList.add('form-error')
            } else {
                form.submit();
            }

           

        }, false)
    },

    /**
     * Возвращает список требуемых элементов
     * @param {*} instance - объект формы
     * @returns массив с DOM-элементами
     */
    getRequiredElements(instance) {
        return instance.form.elements;
    },

    getFormButton(instance) {
        return instance.form.buttons.submit;
    },

    /**
     * Устанавливает обработчики формы
     */
    setEvents() {
        const forms = this.elements;
        forms.forEach((instance) => {
            let elements = this.getRequiredElements(instance);
            let button = this.getFormButton(instance);
            elements.forEach((element) => {
                this.onChange(element, instance);
                this.onKeyUp(element, instance);
            });
            this.onSubmit(button, instance);
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

let start = Validity.init.bind(Validity); // Привязка контекста this к валидатору
start('.js-form-native'); // Запуск валидатора
