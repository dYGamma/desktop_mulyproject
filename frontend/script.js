document.addEventListener('DOMContentLoaded', () => {
  const kanjiChars = ['夢','侍','愛','力','風','火','水','光','影','道','空','心'];
  const container = document.querySelector('.kanji-background');
  const count = 30;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = kanjiChars[Math.floor(Math.random() * kanjiChars.length)];

    span.style.left = Math.random() * 100 + 'vw';

    span.style.animationDuration = (8 + Math.random() * 12) + 's';
    span.style.animationDelay = (Math.random() * -20) + 's';
    container.appendChild(span);
  }
  
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const achievementsEl = document.querySelector('.evil-list');

  const storedScrollPos = sessionStorage.getItem('scrollPos');
  if (storedScrollPos) {
    window.scrollTo(0, parseInt(storedScrollPos, 10));
  } else {
    window.scrollTo(0, 0);
  }

  // AOS (анимации при прокрутке)
  AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-out-cubic'
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('a[href="#form"]')) {
      e.preventDefault();
      const formSection = document.querySelector('#form');
      if (formSection) {
        formSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  });

  const form = document.getElementById('salesForm');
  const resultDiv = document.getElementById('result');

  const selectedFiles = [];
  const addFileBtn = document.getElementById('addFileBtn');
  const fileInput = document.getElementById('fileInput');
  const selectedFilesContainer = document.getElementById('selectedFiles');

  addFileBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      alert('Можно добавить максимум 5 файлов');
      return;
    }

    files.forEach(file => {
      selectedFiles.push(file);

      const preview = document.createElement('div');
      preview.className = 'file-preview';
      preview.textContent = file.name;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', () => {
        const idx = selectedFiles.indexOf(file);
        if (idx !== -1) selectedFiles.splice(idx, 1);
        selectedFilesContainer.removeChild(preview);
      });

      preview.appendChild(removeBtn);
      selectedFilesContainer.appendChild(preview);
    });

    fileInput.value = '';
  });

  // Отправка формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const loader = document.createElement('div');
    loader.className = 'loader';
    resultDiv.classList.add('loading');
    resultDiv.appendChild(loader);

    try {
      const recaptchaToken = grecaptcha.getResponse();
      if (!recaptchaToken) throw new Error('Подтвердите, что вы не робот');

      const phonePattern = /^\+?[0-9]{10,15}$/;
      const phone = document.getElementById('phone').value;
      if (!phonePattern.test(phone)) throw new Error('Неверный формат телефона');

      const formData = new FormData();
      formData.append('name', document.getElementById('name').value);
      formData.append('email', document.getElementById('email').value);
      formData.append('phone', phone);
      formData.append('message', document.getElementById('message').value);
      formData.append('recaptchaToken', recaptchaToken);

      selectedFiles.forEach(file => {
        formData.append('photos', file);
      });

      // Отправляем на сервер
      const response = await fetch('/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        resultDiv.textContent = data.message || 'Заявка успешно отправлена!';
        form.reset();
        grecaptcha.reset();
        selectedFiles.length = 0;
        selectedFilesContainer.innerHTML = '';
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (error) {
      resultDiv.textContent = error.message || 'Ошибка соединения с сервером';
      grecaptcha.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить сообщение';
      resultDiv.classList.remove('loading');
      if (resultDiv.querySelector('.loader')) {
        resultDiv.removeChild(resultDiv.querySelector('.loader'));
      }
    }
  });

  const mobileContacts = document.querySelector('.mobile-contacts');
  if (mobileContacts) {
    const contactsToggle = mobileContacts.querySelector('.contacts-toggle');
    contactsToggle.addEventListener('click', () => {
      mobileContacts.classList.toggle('open');
    });
  }

  window.addEventListener('scroll', () => {
    if (!achievementsEl) return;
    const threshold = achievementsEl.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY >= threshold) {
      sessionStorage.setItem('scrollPos', window.scrollY);
    } else {
      sessionStorage.removeItem('scrollPos');
    }
  });
});
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});