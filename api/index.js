require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const os = require('os');

const { verifyRecaptcha } = require('./recaptcha');
const mailer = require('./mailer');
const bot = require('./bot');

const app = express();


const tmpDir = path.join(os.tmpdir(), 'uploads');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({ dest: tmpDir });

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
}));

app.post('/submit', upload.array('photos', 5), async (req, res) => {
  try {
    const { name, email, phone, message, recaptchaToken } = req.body;
    if (!name || !email || !phone || !message || !recaptchaToken) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ error: 'Ошибка проверки reCAPTCHA' });
    }

    const content = `Новая заявка:\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nСообщение: ${message}`;

    const images = [], documents = [];
    (req.files || []).forEach(file => {
      if (file.mimetype.startsWith('image/')) images.push(file);
      else documents.push(file);
    });

    // Отправка в Telegram
    if (images.length) {
      if (images.length === 1) {
        await bot.sendPhoto(images[0].path, content);
      } else {
        const mediaGroup = images.map((f, i) => ({
          type: 'photo',
          media: fs.createReadStream(f.path),
          caption: i === 0 ? content : undefined,
        }));
        await bot.sendMediaGroup(mediaGroup);
      }
    } else {
      await bot.sendMessage(content);
    }
    for (const doc of documents) {
      await bot.sendDocument(doc.path);
    }

    // Почта с вложениями
    const attachments = (req.files || []).map(f => ({
      filename: f.originalname,
      path: f.path,
      contentType: f.mimetype,
    }));
    await mailer.sendMail({ subject: 'Новая заявка', text: content, attachments });

    res.json({ success: true, message: 'Заявка успешно отправлена!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при отправке заявки' });
  } finally {
    (req.files || []).forEach(f => {
      fs.unlink(f.path, () => {});
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));
