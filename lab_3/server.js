const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Статические файлы
app.use(express.static('public'));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});