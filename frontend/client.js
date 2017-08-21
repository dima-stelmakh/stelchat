// Создаем текст сообщений для событий
var strings = {
    'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};
window.onload = function() {
    // Создаем соединение с сервером; websockets почему-то в Хроме не работают, используем xhr
    if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
        var socket = io.connect('http://127.0.0.1:8888', {'transports': ['xhr-polling']});
    } else {
        socket = io.connect('http://127.0.0.1:8888');
    }


    socket.on('connect', function () {


        console.log('CONNECT');


        socket.on('message', function (msg) {
            // Добавляем в лог сообщение, заменив время, имя и текст на полученные
            document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
            // Прокручиваем лог в конец
            document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
        });
        // При нажатии <Enter> или кнопки отправляем текст
        document.querySelector('#input').onkeypress = function(e) {
            if (e.which == '13') {
                // Отправляем содержимое input'а, закодированное в escape-последовательность
                socket.send(escape(document.querySelector('#input').value));
                // Очищаем input
                document.querySelector('#input').value = '';
            }


            console.log('HER-HER-HER');
        };
        document.querySelector('#send').onclick = function() {
            console.log('HER12312-H123123ER-H123123ER');


            socket.send(escape(document.querySelector('#input').value));
            document.querySelector('#input').value = '';
        };
    });
};