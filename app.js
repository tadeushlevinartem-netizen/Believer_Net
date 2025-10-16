const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: false });

console.log('🚀 Northflank Bot запущен!');

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <h1>✅ Telegram Bot на Northflank</h1>
    <p><strong>Status:</strong> ACTIVE 🟢</p>
    <p><a href="/set_webhook">📡 Настроить вебхук</a></p>
    <p><a href="/info">ℹ️ Информация</a></p>
  `);
});

// Настройка вебхука
app.get('/set_webhook', async (req, res) => {
  try {
    const webhookUrl = `${process.env.NF_EXTERNAL_URL}/webhook`;
    await bot.setWebHook(webhookUrl);
    res.send(`✅ Вебхук установлен!<br><strong>URL:</strong> ${webhookUrl}`);
  } catch (error) {
    res.send(`❌ Ошибка: ${error.message}`);
  }
});

// Информация
app.get('/info', (req, res) => {
  res.send(`
    <h2>📊 Информация о сервисе</h2>
    <p><strong>Хостинг:</strong> Northflank</p>
    <p><strong>Статус:</strong> 24/7 активен</p>
    <p><strong>Режим сна:</strong> ❌ Отсутствует</p>
    <p><a href="/">← Назад</a></p>
  `);
});

// Обработчик Telegram вебхука
app.post('/webhook', express.json(), async (req, res) => {
  try {
    const message = req.body.message;
    const chatId = message.chat.id;
    const text = message.text;
    const userName = message.from.first_name;

    console.log(`📨 Сообщение от ${userName}: ${text}`);

    // Логика бота
    if (text === '/start') {
      await bot.sendMessage(chatId, `Привет ${userName}! 👋\nЯ бот на Northflank!`);
    } else if (text === '/northflank') {
      await bot.sendMessage(chatId, '🚀 Хостинг: Northflank.com\n⭐ 2 бесплатных сервиса\n⏰ 24/7 без сна');
    } else if (text === '/status') {
      await bot.sendMessage(chatId, '🟢 Бот активен на Northflank!');
    } else {
      await bot.sendMessage(chatId, `🔊 Эхо: ${text}`);
    }

    res.send('OK');
  } catch (error) {
    console.error('❌ Ошибка:', error);
    res.send('ERROR');
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
