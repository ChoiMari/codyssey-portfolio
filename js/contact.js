(() => {
  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#form-feedback');
  const fields = {
    name: { input: document.querySelector('#contact-name'), error: document.querySelector('#name-error') },
    email: { input: document.querySelector('#contact-email'), error: document.querySelector('#email-error') },
    message: { input: document.querySelector('#contact-message'), error: document.querySelector('#message-error') }
  };

  const validateField = (key) => {
    const value = fields[key].input.value.trim();
    if (!value) return '필수 입력 항목입니다.';
    if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 주소를 입력해 주세요.';
    return '';
  };

  const renderForm = () => {
    Object.entries(fields).forEach(([key, field]) => {
      const message = STATE.form.errors[key] || '';
      field.error.textContent = message;
      field.input.setAttribute('aria-invalid', String(Boolean(message)));
      field.input.classList.toggle('invalid', Boolean(message));
    });
    feedback.textContent = STATE.form.submitted
      ? '입력 내용을 확인했습니다. 이 데모 폼은 메시지를 실제로 전송하지 않습니다.'
      : '';
  };

  Object.entries(fields).forEach(([key, field]) => {
    field.input.addEventListener('input', () => {
      STATE.form.errors[key] = validateField(key);
      STATE.form.submitted = false;
      renderForm();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    Object.keys(fields).forEach((key) => { STATE.form.errors[key] = validateField(key); });
    STATE.form.submitted = Object.values(STATE.form.errors).every((message) => !message);
    renderForm();
    if (!STATE.form.submitted) {
      const firstInvalid = Object.keys(fields).find((key) => STATE.form.errors[key]);
      fields[firstInvalid].input.focus();
    }
  });
})();
