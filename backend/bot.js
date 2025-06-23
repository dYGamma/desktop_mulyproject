// const TelegramBot = require('node-telegram-bot-api');
// const config = require('./config');
// const fs = require('fs');

// const bot = new TelegramBot(config.telegram.token, { polling: false });

// async function sendMessage(message) {
//     return bot.sendMessage(config.telegram.chatId, message);
// }

// async function sendPhoto(photoPath, caption) {
//     return bot.sendPhoto(config.telegram.chatId, fs.createReadStream(photoPath), { caption });
// }

// async function sendMediaGroup(media) {
//     return bot.sendMediaGroup(config.telegram.chatId, media);
// }

// module.exports = { sendMessage, sendPhoto, sendMediaGroup };

const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const fs = require('fs');

const bot = new TelegramBot(config.telegram.token, { polling: false });

/**
 * Отправка текстового сообщения в Telegram
 * @param {string} message - Текст сообщения
 * @returns {Promise}
 */
async function sendMessage(message) {
  return bot.sendMessage(config.telegram.chatId, message);
}

/**
 * Отправка фото в Telegram
 * @param {string} photoPath - Локальный путь к файлу с фото
 * @param {string} caption - Подпись к фото
 * @returns {Promise}
 */
async function sendPhoto(photoPath, caption) {
  return bot.sendPhoto(
    config.telegram.chatId,
    fs.createReadStream(photoPath),
    { caption }
  );
}

/**
 * Отправка медиагруппы (несколько фото) в Telegram
 * @param {Array} media - Массив объектов { type: 'photo', media: ReadStream, caption?: string }
 * @returns {Promise}
 */
async function sendMediaGroup(media) {
  return bot.sendMediaGroup(config.telegram.chatId, media);
}

/**
 * Отправка документа (PDF, DOC, и т.д.) в Telegram
 * @param {string} docPath - Локальный путь к файлу-документу
 * @param {string} caption - Подпись к документу
 * @returns {Promise}
 */
async function sendDocument(docPath, caption) {
  return bot.sendDocument(
    config.telegram.chatId,
    fs.createReadStream(docPath),
    { caption }
  );
}

// Экспорт функций для использования в других модулях
module.exports = {
  sendMessage,
  sendPhoto,
  sendMediaGroup,
  sendDocument
};
