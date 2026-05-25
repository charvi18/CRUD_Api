/**
 * register.js — Student Registration Page logic
 * Backend fields:
 * id, name, age, course, email
 */

(function () {
  'use strict';

  const form = document.getElementById('registerForm');

  // ───────────────────────────────────────────────────────────
  // EMAIL REGEX
  // ───────────────────────────────────────────────────────────

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ───────────────────────────────────────────────────────────
  // VALIDATION
  // ───────────────────────────────────────────────────────────

  function validateField(name, value) {

    switch (name) {

      case 'name':
        return value.trim()
          ? ''
          : 'Name is required';

      case 'email':

        if (!value.trim()) {
          return 'Email is required';
        }

        return EMAIL_REGEX.test(value)
          ? ''
          : 'Enter valid email address';

      case 'course':
        return value.trim()
          ? ''
          : 'Course is required';

      case 'age':

        if (value === '') {
          return 'Age is required';
        }

        if (isNaN(Number(value))) {
          return 'Age must be a number';
        }

        if (Number(value) < 1 || Number(value) > 100) {
          return 'Age must be between 1 and 100';
        }

        return '';

      default:
        return '';
    }
  }

  // ───────────────────────────────────────────────────────────
  // SET FIELD ERROR
  // ───────────────────────────────────────────────────────────

  function setFieldError(fieldName, message) {

    const input =
      document.getElementById(fieldName);

    const errEl =
      document.getElementById(`err-${fieldName}`);

    if (!input || !errEl) {
      return;
    }

    if (message) {
      input.classList.add('is-error');
      errEl.textContent = message;
    } else {
      input.classList.remove('is-error');
      errEl.textContent = '';
    }
  }

  // ───────────────────────────────────────────────────────────
  // LIVE VALIDATION
  // ───────────────────────────────────────────────────────────

  form.querySelectorAll('.field-input').forEach((input) => {

    input.addEventListener('input', () => {

      const fieldName =
        input.name || input.id;

      const error =
        validateField(fieldName, input.value);

      setFieldError(fieldName, error);
    });
  });

  // ───────────────────────────────────────────────────────────
  // FORM SUBMIT
  // ───────────────────────────────────────────────────────────

  form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const fields = [
      'name',
      'email',
      'course',
      'age',
    ];

    let hasError = false;

    // Validate all fields
    fields.forEach((fieldName) => {

      const el =
        document.getElementById(fieldName);

      const value =
        el ? el.value : '';

      const error =
        validateField(fieldName, value);

      setFieldError(fieldName, error);

      if (error) {
        hasError = true;
      }
    });

    if (hasError) {

      showToast(
        'toast',
        'Please fix the errors above.',
        'error',
      );

      return;
    }

    // ─────────────────────────────────────────────────────────
    // PAYLOAD
    // ─────────────────────────────────────────────────────────

    const payload = {
      name:
        document.getElementById('name')
          .value
          .trim(),

      email:
        document.getElementById('email')
          .value
          .trim(),

      course:
        document.getElementById('course')
          .value
          .trim(),

      age:
        Number(
          document.getElementById('age').value,
        ),
    };

    setButtonLoading('submitBtn', true);

    try {

      const res =
        await StudentsAPI.create(payload);

      showToast(
        'toast',
        res.message || 'Student registered successfully!',
        'success',
      );

      form.reset();

      // Clear all field errors
      fields.forEach((field) => {
        setFieldError(field, '');
      });

      // Dashboard link
      setTimeout(() => {

        const toast =
          document.getElementById('toast');

        if (
          toast &&
          !toast.classList.contains('hidden')
        ) {

          toast.innerHTML += `
            <a
              href="dashboard.html"
              style="
                color: inherit;
                font-weight: 700;
                text-decoration: underline;
                margin-left: 8px;
              "
            >
              View Dashboard →
            </a>
          `;
        }

      }, 300);

    } catch (err) {

      // Backend validation errors
      if (err.errors && err.errors.length > 0) {

        err.errors.forEach(({ field, message }) => {
          setFieldError(field, message);
        });

        showToast(
          'toast',
          'Please fix the highlighted fields.',
          'error',
        );

      } else {

        showToast(
          'toast',
          err.message || 'Failed to register student.',
          'error',
        );
      }

    } finally {

      setButtonLoading('submitBtn', false);
    }
  });

})();