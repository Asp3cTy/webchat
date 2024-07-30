document.addEventListener('DOMContentLoaded', function() {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;
    let userId; // Para armazenar o ID do usuário
    let lastMinute = null;
    let lastSender = null;
    let replyingTo = null;
    let typingTimeout;
    let originalTitle = document.title;
    let flashing = false;

    // Função para alternar entre modos claro e escuro
    function toggleMode() {
        const body = document.body;
        const modeButton = document.getElementById('toggle-mode');
        const modeText = document.getElementById('dropdown-toggle-mode');

        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');

        if (body.classList.contains('light-mode')) {
            modeButton.textContent = 'Modo Escuro';
            modeText.textContent = 'Modo Escuro';
            localStorage.setItem('mode', 'light');
        } else {
            modeButton.textContent = 'Modo Claro';
            modeText.textContent = 'Modo Claro';
            localStorage.setItem('mode', 'dark');
        }
    }

    // Carregar o modo preferido do usuário
    function loadMode() {
        const savedMode = localStorage.getItem('mode');
        if (savedMode === 'light') {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            document.getElementById('toggle-mode').textContent = 'Modo Escuro';
            document.getElementById('dropdown-toggle-mode').textContent = 'Modo Escuro';
        } else {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            document.getElementById('toggle-mode').textContent = 'Modo Claro';
            document.getElementById('dropdown-toggle-mode').textContent = 'Modo Claro';
        }
    }

    // Verifica se há informações de login no localStorage
    function checkLogin() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            uname = user.username;
            userId = user.userId;
            app.querySelector(".join-screen").classList.remove("active");
            app.querySelector(".chat-screen").classList.add("active");
            loadMessages(); // Carregar mensagens salvas
            socket.emit("newuser", uname); // Emitir evento de novo usuário
        }
    }

    // Recuperar mensagens do localStorage
    function loadMessages() {
        const messageContainer = app.querySelector(".messages");
        messageContainer.innerHTML = ''; // Limpa o contêiner de mensagens antes de carregar
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.forEach(message => {
            const type = (message.username === uname) ? "my" : "other";
            renderMessage(type, message);
        });
    }

    // Salvar mensagens no localStorage
    function saveMessage(message) {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        // Verifica se a mensagem já existe para evitar duplicatas
        if (!messages.some(msg => msg.id === message.id)) {
            messages.push(message);
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    }

    // Limpar mensagens do localStorage e do DOM
    function clearChat() {
        localStorage.removeItem('messages');
        const messageContainer = app.querySelector(".messages");
        messageContainer.innerHTML = '';
    }

    app.querySelector("#login-user").addEventListener("click", function() {
        let username = app.querySelector("#login-username").value;
        let password = app.querySelector("#login-password").value;
        if (username.length === 0 || password.length === 0) {
            return;
        }
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User logged in') {
                uname = username;
                userId = data.userId; // Obter o ID do usuário
                localStorage.setItem('user', JSON.stringify({ username, userId }));
                app.querySelector(".join-screen").classList.remove("active");
                app.querySelector(".chat-screen").classList.add("active");
                socket.emit("newuser", username); // Emitir evento de novo usuário
                loadMessages(); // Carregar mensagens após o login
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    app.querySelector("#register-user").addEventListener("click", function() {
        let username = app.querySelector("#reg-username").value;
        let password = app.querySelector("#reg-password").value;
        if (username.length === 0 || password.length === 0) {
            return;
        }
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => console.error('Error:', error));
    });

    app.querySelector("#show-register").addEventListener("click", function() {
        showAuthDialog();
    });

    app.querySelector("#show-login").addEventListener("click", function() {
        document.querySelector(".form").style.display = 'block';
        document.querySelector("#register-form").style.display = 'none';
    });

    function showAuthDialog() {
        const authDialog = document.getElementById('auth-dialog');
        authDialog.style.display = 'block';
    }

    function hideAuthDialog() {
        const authDialog = document.getElementById('auth-dialog');
        authDialog.style.display = 'none';
    }

    function checkAuthPassword() {
        const authPassword = document.getElementById('auth-password').value;
        if (authPassword === 'babybaby2024') {
            hideAuthDialog();
            document.querySelector(".form").style.display = 'none';
            document.querySelector("#register-form").style.display = 'block';
        } else {
            alert('Senha incorreta. Tente novamente.');
        }
    }

    document.getElementById('auth-submit').addEventListener('click', checkAuthPassword);
    document.getElementById('auth-cancel').addEventListener('click', hideAuthDialog);

    function sendMessage() {
        let message = app.querySelector("#message-input").value;
        if (message.length === 0) {
            return;
        }
        const currentTime = getBrasiliaTime();
        const messageId = Date.now();
        const msgObj = {
            id: messageId,
            username: uname,
            text: message,
            time: currentTime,
            replyTo: replyingTo
        };
        renderMessage("my", msgObj);
        saveMessage(msgObj); // Salvar mensagem no localStorage
        socket.emit("chat", msgObj);
        app.querySelector("#message-input").value = "";
        clearReply();
        socket.emit("stopTyping", { username: uname }); // Emitir evento de parar de digitar
    }

    function handlePaste(event) {
        const items = (event.clipboardData || window.clipboardData).items;
        for (let item of items) {
            if (item.type.indexOf("image") !== -1 || item.type === "image/gif") {
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    sendImage(imageUrl);
                };
                reader.readAsDataURL(blob);
                event.preventDefault();
            }
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        for (let file of files) {
            if (file.type.indexOf("image") !== -1 || file.type === "image/gif") {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    sendImage(imageUrl);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    function sendImage(imageUrl) {
        const currentTime = getBrasiliaTime();
        const messageId = Date.now();
        const msgObj = {
            id: messageId,
            username: uname,
            image: imageUrl,
            time: currentTime,
            replyTo: replyingTo
        };
        renderMessage("my", msgObj);
        saveMessage(msgObj); // Salvar imagem no localStorage
        socket.emit("chat", msgObj);
        clearReply();
    }

    function getBrasiliaTime() {
        const brasiliaOffset = -3;
        const date = new Date();
        const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
        const brasiliaTime = new Date(utcTime + (3600000 * brasiliaOffset));
        const hours = brasiliaTime.getHours().toString().padStart(2, '0');
        const minutes = brasiliaTime.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".messages");

        let el = document.createElement("div");
        el.setAttribute("class", `message ${type}-message`);
        el.setAttribute("data-id", message.id);

        let content = `
            <div class="message-content">
                <div class="message-text">
                    <div class="name">${type === "my" ? "Você" : message.username}</div>
                    <div class="text">${linkify(message.text ? message.text : '')}</div>
                    ${message.image ? `<img src="${message.image}" alt="Image" class="chat-image"/>` : ''}
                    <div class="time">${message.time}</div>
                </div>
            </div>
        `;

        if (message.replyTo) {
            content = `
                <div class="message-content">
                    <div class="message-text">
                        <div class="reply-to">
                            <div class="reply-text">Respondendo a: ${message.replyTo.text || 'imagem'}</div>
                        </div>
                        <div>
                            <div class="name">${type === "my" ? "Você" : message.username}</div>
                            <div class="text">${linkify(message.text ? message.text : '')}</div>
                            ${message.image ? `<img src="${message.image}" alt="Image" class="chat-image"/>` : ''}
                            <div class="time">${message.time}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        el.innerHTML = content;

        // Adiciona o event listener apenas ao balão da mensagem
        el.querySelector('.message-text').addEventListener("click", function() {
            setReply(message);
        });

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;

        // Navegador piscando na barra de tarefas
        if (type === "other") {
            flashTitle("Nova mensagem!");
        }
    }

    function linkify(text) {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
    }

    function renderUpdate(update) {
        let messageContainer = app.querySelector(".messages");
        let el = document.createElement("div");
        el.setAttribute("class", "update");
        el.innerText = update;
        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    function logoutUser() {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deslogar');
            }
            return response.text();
        })
        .then(data => {
            if (data === 'User logged out') {
                localStorage.removeItem('user');
                socket.emit("exituser", uname);
                document.querySelector(".chat-screen").classList.remove("active");
                document.querySelector(".join-screen").classList.add("active");
            } else {
                alert('Erro ao deslogar. Tente novamente.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function setReply(message) {
        replyingTo = message;
        const replySection = document.querySelector(".reply-section");
        const replyingToText = document.querySelector("#replying-to");
        replyingToText.innerText = `Respondendo a: ${message.text || 'imagem'}`;
        replySection.classList.add("active");
    }

    function clearReply() {
        replyingTo = null;
        const replySection = document.querySelector(".reply-section");
        const replyingToText = document.querySelector("#replying-to");
        replyingToText.innerText = '';
        replySection.classList.remove("active");
    }

    document.querySelector("#cancel-reply").addEventListener("click", clearReply);

    // Inicializa o seletor de emoji
    const picker = document.createElement('emoji-picker');
    picker.style.position = 'absolute';
    picker.style.display = 'none';
    picker.setAttribute('locale', 'pt_BR');
    document.body.appendChild(picker);

    // Função para posicionar o seletor de emojis de forma responsiva
    function positionEmojiPicker() {
        const trigger = document.querySelector('#emoji-button');
        const rect = trigger.getBoundingClientRect();
        
        const margin = 10; // Margem para ajustar a posição
        
        picker.style.top = `${rect.top - picker.offsetHeight - margin}px`;
        picker.style.left = `${rect.left}px`;

        // Ajusta o tamanho do seletor de emojis com base no tamanho da tela
        if (window.innerWidth < 600) {
            picker.style.width = '90%';
            picker.style.maxHeight = '200px';
            picker.style.left = '5%';
        } else {
            picker.style.width = 'auto';
            picker.style.maxHeight = '400px';
        }

        // Garantir que o seletor de emojis não ultrapasse os limites da tela
        const pickerRect = picker.getBoundingClientRect();
        if (pickerRect.right > window.innerWidth) {
            picker.style.left = `${window.innerWidth - pickerRect.width - margin}px`;
        }
        if (pickerRect.left < 0) {
            picker.style.left = `${margin}px`;
        }
        if (pickerRect.top < 0) {
            picker.style.top = `${rect.bottom + margin}px`;
        }
    }

    const trigger = document.querySelector('#emoji-button');
    trigger.addEventListener('click', () => {
        picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
        if (picker.style.display === 'block') {
            positionEmojiPicker();
        }
    });

    picker.addEventListener('emoji-click', event => {
        const input = app.querySelector("#message-input");
        input.value += event.detail.unicode;
        input.focus();
    });

    document.addEventListener('click', function(event) {
        const isClickInside = picker.contains(event.target) || trigger.contains(event.target);
        if (!isClickInside) {
            picker.style.display = 'none';
        }
    });

    app.querySelector("#send-message").addEventListener("click", sendMessage);

    app.querySelector("#message-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    app.querySelector("#message-input").addEventListener("paste", handlePaste);

    app.querySelector(".chat-screen").addEventListener("dragover", handleDragOver);
    app.querySelector(".chat-screen").addEventListener("drop", handleDrop);

    document.querySelector("#clear-chat").addEventListener("click", function() {
        clearChat();
    });

    document.querySelector("#exit-chat").addEventListener("click", function() {
        logoutUser();
    });
    
    document.querySelector("#toggle-mode").addEventListener("click", function() {
        toggleMode();
    });

    document.querySelector("#dropdown-toggle-mode").addEventListener("click", function() {
        toggleMode();
    });

    document.querySelector("#dropdown-clear-chat").addEventListener("click", function() {
        clearChat();
    });

    document.querySelector("#dropdown-exit-chat").addEventListener("click", function() {
        logoutUser();
    });

    // Função para fazer o navegador piscar na barra de tarefas
    function flashTitle(newMsg) {
        flashing = true;
        let interval = setInterval(() => {
            if (!flashing) {
                clearInterval(interval);
                document.title = originalTitle;
                return;
            }
            document.title = (document.title === originalTitle) ? newMsg : originalTitle;
        }, 1000);
    }

    // Parar de piscar o título quando a aba se torna ativa
    window.addEventListener('focus', function() {
        flashing = false;
        document.title = originalTitle;
    });

    // Emitir evento de digitação
    app.querySelector("#message-input").addEventListener("input", function() {
        if (this.value.length > 0) {
            socket.emit("typing", { username: uname });
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit("stopTyping", { username: uname });
            }, 1000);
        } else {
            socket.emit("stopTyping", { username: uname });
        }
    });

    socket.on("update", function(update) {
        renderUpdate(update);
    });

    socket.on("chat", function(message) {
        if (message.username !== uname) {
            renderMessage("other", message);
            saveMessage(message); // Salvar mensagem recebida no localStorage
        }
    });

    socket.on("userCount", function(count) {
        document.getElementById("user-count").innerText = count;
    });

    socket.on("typing", function(data) {
        const typingIndicator = document.getElementById("typing-indicator");
        typingIndicator.innerText = `${data.username} está digitando...`;
        typingIndicator.style.display = "block";
    });

    socket.on("stopTyping", function(data) {
        const typingIndicator = document.getElementById("typing-indicator");
        typingIndicator.style.display = "none";
    });

    // Verifica login ao carregar a página
    checkLogin();

    // Carregar o modo preferido do usuário ao carregar a página
    loadMode();
});
