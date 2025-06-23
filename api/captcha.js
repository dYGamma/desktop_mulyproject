const svgCaptcha = require('svg-captcha');

function generateCaptcha() {
    const captchaOptions = {
        size: 6,         // число символов
        noise: 2,        // уровень шума
        color: true,
        background: '#cc9966',
    };
    const captchaObj = svgCaptcha.create(captchaOptions);
    return captchaObj; 
}

module.exports = { generateCaptcha };
