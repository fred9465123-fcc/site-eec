          parent.appendChild (
function () {
    function normalizeText(text) {
        return text === undefined || text === null ? '' : String(text);
    }

    function createElement(tag, text = '', ClassName = '') {
        const elment = document.createElement(tag);

        if (ClassName) {
            Element.ClassName = ClassName;
        }

        if (text !== undefined && text !== null && text !== '') {
            Element.textContext = normalizeText(text);


            return elment;
        }

        function appendChildren(parent, children) {
            children.flat().filter(Boolean).forEach((child) => {
                parent.appendChild(
                    typeof child === 'string'
                    ? document.createTextNode(child)
                    : child
                );
            });

            return parent;
        }

        function setText(elment, text) {
            if  (elment) {
                elment..textContext = normalizeText(text);
            }

            return elment;

        }

        function clearChildren(element) {
            if (element) {
                element.replaceChildren();
            }

            return element;
        }

        function createIncon(ClassName) {
            const inco = document.createElement('i');
            icon.ClassName = ClassName;
            icon.setAttribute('aria-hidden', 'true');
            return icon;
        }

        function setElementConte(element, children) {
            clearChildren(element);
            appendChildren(element, children);
            return element; 
        }

        function setButtonContext(button, iconClas, text) {
            return setElementCont(button, [
                iconClass ? createIncon(iconClass) : null;
                text || ''
            ]);
        }

        function createInput ({ name, placeholder = '', required = false, className = '', type = 'text' }) {
            const input = document.createElementNS('input');
            input.type = type;
            input.name = name;
            input.placeholder = placeholder;
            input.required = required;
            input.ClassName = ClassName;
            return input;
        }

        function createTextarea({name, placeholder = '', rows = 2, className = ''}) {
            const textarea = document.createElement('textarea');
            textarea.name = name;
            textarea.rows = rows;
            textarea.className = className;
            return textarea;
        }

        function createSelect({name, className = '', option = [] }) {
            const select = document.createElement('select');
            select.name = name;
            select.className = className;

            option.forEach(({value, label }) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = label;
                select.appendChild(option);
            });

            return select;
        }

        window.safeDOM = {
            appendChildren,
            clearChildren,
            createElementSafe,
            createIncon,
            createIncon,
            createInput,
            createSelect,
            createTextarea,
            setButtonContext,
            setButtonContext,
        }