// Удаляем node-fetch, так как в Node.js 22+ fetch встроен [[6]][[10]]
// const fetch = require('node-fetch'); // Удаляем эту строку

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
      body: `secret=${secret}&response=${token}` 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.success === true;
  } catch (error) {
    console.error('Ошибка проверки reCAPTCHA:', error);
    return false;
  }
}

module.exports = { verifyRecaptcha };