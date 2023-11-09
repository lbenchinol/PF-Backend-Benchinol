(function () {
    const socket = io();

    const formMessage = document.getElementById('form-message');
    const inputMessage = document.getElementById('input-message');
    const chat = document.getElementById('chat');

    let username;

    Swal.fire({
        title: 'Identificación!',
        input: 'text',
        inputLabel: 'Ingresa tu nombre de usuario',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingresa tu nombre de usuario para continuar!'
            }
        }
    })
        .then((result) => {
            username = result.value.trim();
        });

    formMessage.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = inputMessage.value.trim();
        socket.emit('new-message', { username, message });
        inputMessage.value = '';
        inputMessage.focus();
    })

    const updateMessages = (messages) => {
        chat.innerText = '';
        messages.forEach((m) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${m.username}: ${m.message}</td>`;
            chat.appendChild(tr);
        });
    }

    socket.on('chat-updated', ({ messages }) => {
        updateMessages(messages);
    });

})();