// ── Password visibility toggles ───────────────────
function bindPwToggle(inputId, toggleId) {
  const input  = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  if (!input || !toggle) return;

  toggle.addEventListener('click', () => {
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    toggle.innerHTML = hidden
      ? '<i data-lucide="eye-off"></i>'
      : '<i data-lucide="eye"></i>';
    lucide.createIcons();
  });
}

bindPwToggle('password', 'pwToggle');
bindPwToggle('confirm_password', 'confirmPwToggle');

// ── Password strength ─────────────────────────────
const pwInput      = document.getElementById('password');
const strengthFill = document.getElementById('pwStrengthFill');
const strengthLabel = document.getElementById('pwStrengthLabel');

function getStrength(val) {
  if (!val) return null;
  let score = 0;
  if (val.length >= 8)            score++;
  if (/[A-Z]/.test(val))          score++;
  if (/[0-9]/.test(val))          score++;
  if (/[^A-Za-z0-9]/.test(val))   score++;
  if (score <= 1) return 'weak';
  if (score <= 2) return 'fair';
  return 'strong';
}

if (pwInput && strengthFill && strengthLabel) {
  pwInput.addEventListener('input', () => {
    const level = getStrength(pwInput.value);
    strengthFill.className  = 'pw-strength-fill' + (level ? ' ' + level : '');
    strengthLabel.className = 'pw-strength-label' + (level ? ' ' + level : '');
    const labels = { weak: 'Weak', fair: 'Fair', strong: 'Strong' };
    strengthLabel.textContent = level ? labels[level] : '';
  });
}

// ── Sign-up form validation ───────────────────────
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    let valid = true;

    function setError(id, msg) {
      const el = document.getElementById(id);
      const input = signupForm.querySelector(`[name="${id.replace('Error', '')}"]`);
      if (el) el.textContent = msg;
      if (input && msg) input.classList.add('error');
      if (msg) valid = false;
    }

    function clearAll() {
      signupForm.querySelectorAll('.login-field-error').forEach(el => el.textContent = '');
      signupForm.querySelectorAll('.login-input').forEach(el => el.classList.remove('error'));
    }

    clearAll();

    const firstName   = document.getElementById('first_name');
    const lastName    = document.getElementById('last_name');
    const displayName = document.getElementById('display_name');
    const email       = document.getElementById('email');
    const pw          = document.getElementById('password');
    const pwConfirm   = document.getElementById('confirm_password');

    if (firstName && !firstName.value.trim())    setError('firstNameError',       'Please enter your first name.');
    if (lastName  && !lastName.value.trim())     setError('lastNameError',        'Please enter your last name.');
    if (displayName && !displayName.value.trim()) setError('displayNameError',    'Please enter a display name.');

    if (email) {
      if (!email.value.trim()) {
        setError('emailError', 'Please enter your email address.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError('emailError', 'Please enter a valid email address.');
      }
    }

    if (pw) {
      if (!pw.value) {
        setError('passwordError', 'Please enter a password.');
      } else if (pw.value.length < 8) {
        setError('passwordError', 'Password must be at least 8 characters.');
      }
    }

    if (pwConfirm && pw) {
      if (!pwConfirm.value) {
        setError('confirmPasswordError', 'Please confirm your password.');
      } else if (pwConfirm.value !== pw.value) {
        setError('confirmPasswordError', 'Passwords do not match.');
      }
    }

    if (!valid) e.preventDefault();
  });
}

// ── Household action toggle (step 2) ─────────────
const tabCreate      = document.getElementById('tabCreate');
const tabJoin        = document.getElementById('tabJoin');
const createFields   = document.getElementById('createFields');
const joinFields     = document.getElementById('joinFields');
const actionInput    = document.getElementById('householdAction');

function setAction(action) {
  if (!tabCreate || !tabJoin) return;
  const isCreate = action === 'create';

  tabCreate.classList.toggle('active', isCreate);
  tabJoin.classList.toggle('active', !isCreate);

  if (createFields) createFields.style.display = isCreate ? '' : 'none';
  if (joinFields)   joinFields.style.display   = isCreate ? 'none' : '';
  if (actionInput)  actionInput.value = action;
}

if (tabCreate) tabCreate.addEventListener('click', () => setAction('create'));
if (tabJoin)   tabJoin.addEventListener('click',   () => setAction('join'));

// Initialise from hidden field value on page load
if (actionInput) setAction(actionInput.value || 'create');

// ── Household form validation (step 2) ────────────
const householdForm = document.getElementById('householdForm');

if (householdForm) {
  householdForm.addEventListener('submit', (e) => {
    let valid = true;
    const action = actionInput ? actionInput.value : 'create';

    if (action === 'create') {
      const name = document.getElementById('household_name');
      const nameErr = document.getElementById('householdNameError');
      if (name && !name.value.trim()) {
        if (nameErr) nameErr.textContent = 'Please enter a household name.';
        name.classList.add('error');
        valid = false;
      }
    } else {
      const code = document.getElementById('join_code');
      const codeErr = document.getElementById('joinCodeError');
      if (code && !code.value.trim()) {
        if (codeErr) codeErr.textContent = 'Please enter an invite code.';
        code.classList.add('error');
        valid = false;
      }
    }

    if (!valid) e.preventDefault();
  });
}
