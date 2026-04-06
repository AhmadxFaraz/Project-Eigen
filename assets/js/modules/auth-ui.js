(function () {
  const MIN_PASSWORD_LENGTH = 6;

  function normalizeError(err) {
    if (!err) return 'Unknown error.';
    if (typeof err === 'string') return err;
    if (err.message) return err.message;
    try {
      return JSON.stringify(err);
    } catch (_) {
      return 'Unknown error.';
    }
  }

  function mapAuthError(err, context) {
    const raw = normalizeError(err);
    const message = raw.toLowerCase();
    const code = String((err && (err.code || err.error_code || err.status)) || '').toLowerCase();

    if (
      message.includes('invalid email') ||
      message.includes('email address is invalid') ||
      message.includes('unable to validate email')
    ) {
      return 'Enter a valid email address and try again.';
    }

    if (message.includes('user already registered') || message.includes('already been registered')) {
      return 'An account with this email already exists. Try signing in instead.';
    }

    if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
      return 'Incorrect email or password. Please try again.';
    }

    if (message.includes('password should be at least') || message.includes('weak password') || code === 'weak_password') {
      return `Password is too weak. Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (
      message.includes('expired') ||
      message.includes('otp') ||
      message.includes('token') ||
      message.includes('recovery link') ||
      code === 'otp_expired' ||
      code === 'otp_disabled' ||
      code === 'invalid_grant'
    ) {
      return 'This reset link is invalid or expired. Request a new password reset link.';
    }

    if (
      message.includes('redirect') ||
      message.includes('redirect_to') ||
      message.includes('not allowed') ||
      message.includes('site url')
    ) {
      return 'Auth redirect is not configured correctly. Update Site URL and Redirect URLs in Supabase settings.';
    }

    if (message.includes('rate limit') || message.includes('too many requests') || code === '429') {
      return 'Too many attempts right now. Please wait a moment and try again.';
    }

    if (message.includes('failed to fetch') || message.includes('network') || message.includes('timeout')) {
      return 'Network issue detected. Check your internet connection and retry.';
    }

    if (context === 'reset-email') {
      return 'Could not send reset link. Please verify the email and try again.';
    }

    if (context === 'signup') {
      return 'Could not create account right now. Please try again.';
    }

    if (context === 'update-password') {
      return 'Could not update password. Try again or request a new reset link.';
    }

    return 'Something went wrong. Please try again.';
  }

  function setStatus(text, isError) {
    const el = document.getElementById('auth-status');
    if (!el) return;
    el.textContent = text;
    el.className = isError ? 'text-red-400 text-sm mt-3' : 'text-emerald-300 text-sm mt-3';
  }

  function getDisplayName(user) {
    if (!user) return '';
    const meta = user.user_metadata || {};
    if (meta.full_name && String(meta.full_name).trim()) return String(meta.full_name).trim();
    if (user.email) return user.email.split('@')[0];
    return 'Account';
  }

  function getClientOrStatus() {
    if (window.location.protocol === 'file:') {
      setStatus('Open this page via http://localhost or your deployed URL. file:// mode can break auth.', true);
      return null;
    }

    if (!window.SupabaseClient || !window.SupabaseClient.isConfigured()) {
      setStatus('Set valid SUPABASE_URL + SUPABASE_ANON_KEY in assets/js/supabase-config.js', true);
      return null;
    }

    return window.SupabaseClient.getClient();
  }

  function wireShowPassword() {
    const toggles = document.querySelectorAll('[data-toggle-password]');
    toggles.forEach(function (toggle) {
      const targetId = toggle.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      toggle.addEventListener('change', function () {
        input.type = toggle.checked ? 'text' : 'password';
      });
    });
  }

  function parseAuthParams() {
    const hash = String(window.location.hash || '').replace(/^#/, '');
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(window.location.search || '');

    return {
      type: hashParams.get('type') || queryParams.get('type') || '',
      accessToken: hashParams.get('access_token') || queryParams.get('access_token') || '',
      recoveryToken: hashParams.get('recovery_token') || queryParams.get('recovery_token') || '',
      error: hashParams.get('error') || queryParams.get('error') || '',
      errorCode: hashParams.get('error_code') || queryParams.get('error_code') || '',
      errorDescription: hashParams.get('error_description') || queryParams.get('error_description') || '',
      notice: queryParams.get('notice') || ''
    };
  }

  function safeDecode(value) {
    if (!value) return '';
    try {
      return decodeURIComponent(value);
    } catch (_) {
      return value;
    }
  }

  function hasRecoveryHint(params) {
    return params.type === 'recovery' || Boolean(params.recoveryToken);
  }

  function hasSignupConfirmationHint(params) {
    return params.type === 'signup';
  }

  function clearAuthUrl(notice) {
    const nextUrl = notice ? `${window.location.pathname}?notice=${notice}` : window.location.pathname;
    window.history.replaceState({}, document.title, nextUrl);
  }

  function getStatusFromNotice(params) {
    if (params.notice === 'login_required') {
      return {
        text: 'Please sign in to access account security settings.',
        isError: true
      };
    }

    if (params.notice === 'password_changed') {
      return {
        text: 'Password changed successfully. Please sign in with your new password.',
        isError: false
      };
    }

    if (params.notice === 'signup_confirmed') {
      return {
        text: 'Email confirmed successfully. Your account is now active.',
        isError: false
      };
    }

    return null;
  }

  async function getCurrentUser(client) {
    if (window.TrackerCloud && typeof window.TrackerCloud.getUser === 'function') {
      return window.TrackerCloud.getUser();
    }

    const { data } = await client.auth.getUser();
    return data && data.user ? data.user : null;
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  async function waitForRecoveryUser(client, attempts, intervalMs) {
    let index = 0;
    while (index < attempts) {
      const user = await getCurrentUser(client);
      if (user) return user;
      index += 1;
      if (index < attempts) {
        await sleep(intervalMs);
      }
    }
    return null;
  }

  async function refreshUserView(client) {
    const userBox = document.getElementById('auth-user');
    const actions = document.getElementById('auth-actions');
    const form = document.getElementById('auth-form');
    const switchLink = document.getElementById('switch-auth-link');

    if (!userBox || !actions || !form) return;

    const user = await getCurrentUser(client);
    if (user) {
      userBox.textContent = `Logged in as: ${getDisplayName(user)} (${user.email})`;
      actions.classList.remove('hidden');
      form.classList.add('hidden');
      if (switchLink) switchLink.classList.add('hidden');
    } else {
      userBox.textContent = 'Not logged in';
      actions.classList.add('hidden');
      form.classList.remove('hidden');
      if (switchLink) switchLink.classList.remove('hidden');
    }
  }

  function setButtonsBusy(buttons, isBusy) {
    buttons.forEach(function (btn) {
      if (!btn) return;
      btn.disabled = isBusy;
      btn.classList.toggle('opacity-70', isBusy);
      btn.classList.toggle('cursor-not-allowed', isBusy);
    });
  }

  async function runWithBusy(buttons, action) {
    setButtonsBusy(buttons, true);
    try {
      return await action();
    } finally {
      setButtonsBusy(buttons, false);
    }
  }

  async function signIn(email, password) {
    const client = window.SupabaseClient.getClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(fullName, email, password) {
    const client = window.SupabaseClient.getClient();
    const emailRedirectTo = getSignupRedirectUrl();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || '' },
        emailRedirectTo
      }
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const client = window.SupabaseClient.getClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async function sendPasswordResetEmail(email) {
    const client = window.SupabaseClient.getClient();
    const redirectTo = getPasswordResetRedirectUrl();
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  }

  function getPasswordResetRedirectUrl() {
    const explicit = String(window.SUPABASE_AUTH_REDIRECT_URL || '').trim();
    if (explicit) return explicit;

    try {
      return new URL('login.html', window.location.href).toString();
    } catch (_) {
      return `${window.location.origin}/login.html`;
    }
  }

  function getSignupRedirectUrl() {
    const explicit = String(window.SUPABASE_SIGNUP_REDIRECT_URL || '').trim();
    if (explicit) return explicit;
    try {
      return new URL('signup.html', window.location.href).toString();
    } catch (_) {
      return `${window.location.origin}/signup.html`;
    }
  }

  async function updatePassword(newPassword) {
    const client = window.SupabaseClient.getClient();
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  function validateCredentials(email, password) {
    if (!email || !password) {
      setStatus('Email and password are required.', true);
      return false;
    }

    if (!isValidEmail(email)) {
      setStatus('Enter a valid email address.', true);
      return false;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatus(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, true);
      return false;
    }
    return true;
  }

  function isValidEmail(email) {
    const value = String(email || '').trim();
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateEmailOnly(email, emptyMessage) {
    const value = String(email || '').trim();
    if (!value) {
      setStatus(emptyMessage || 'Email is required.', true);
      return false;
    }

    if (!isValidEmail(value)) {
      setStatus('Enter a valid email address.', true);
      return false;
    }

    return true;
  }

  function validateNewPasswordInputs(newPassword, confirmPassword) {
    if (!newPassword || !confirmPassword) {
      setStatus('Both password fields are required.', true);
      return false;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setStatus(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`, true);
      return false;
    }

    if (newPassword !== confirmPassword) {
      setStatus('Passwords do not match.', true);
      return false;
    }

    return true;
  }

  async function initLoginPage() {
    const client = getClientOrStatus();
    wireShowPassword();
    if (!client) return;

    const form = document.getElementById('auth-form');
    const recoveryForm = document.getElementById('recovery-form');
    const signInBtn = document.getElementById('signin-btn');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');
    const updatePasswordBtn = document.getElementById('update-password-btn');
    const signOutBtn = document.getElementById('signout-btn');
    const userBox = document.getElementById('auth-user');
    const switchLink = document.getElementById('switch-auth-link');

    if (!form || !recoveryForm || !signInBtn || !forgotPasswordBtn || !updatePasswordBtn || !signOutBtn) return;

    const authParams = parseAuthParams();
    const recoveryHint = hasRecoveryHint(authParams);
    const signupConfirmationHint = hasSignupConfirmationHint(authParams);
    let recoveryMode = false;

    function setLoginModeUi() {
      recoveryMode = false;
      form.classList.remove('hidden');
      recoveryForm.classList.add('hidden');
      if (switchLink) switchLink.classList.remove('hidden');
      if (userBox) userBox.textContent = 'Not logged in';
    }

    function setRecoveryModeUi() {
      recoveryMode = true;
      form.classList.add('hidden');
      recoveryForm.classList.remove('hidden');
      if (switchLink) switchLink.classList.add('hidden');
      if (userBox) userBox.textContent = 'Password recovery mode';
    }

    async function submitSignIn() {
      const email = (document.getElementById('email') || { value: '' }).value.trim();
      const password = (document.getElementById('password') || { value: '' }).value;
      if (!validateCredentials(email, password)) return;

      try {
        setStatus('Signing in...');
        await runWithBusy([signInBtn, forgotPasswordBtn], function () {
          return signIn(email, password);
        });
        setStatus('Signed in successfully.');
        await refreshUserView(client);
      } catch (err) {
        console.error('Sign in error:', err);
        setStatus(mapAuthError(err, 'signin'), true);
      }
    }

    async function submitForgotPassword() {
      const email = (document.getElementById('email') || { value: '' }).value.trim();
      if (!validateEmailOnly(email, 'Enter your email first, then click Forgot Password.')) {
        return;
      }

      try {
        setStatus('Sending reset link...');
        await runWithBusy([forgotPasswordBtn, signInBtn], function () {
          return sendPasswordResetEmail(email);
        });
        setStatus('Password reset link sent. Check your email inbox.');
      } catch (err) {
        console.error('Forgot password error:', err);
        setStatus(mapAuthError(err, 'reset-email'), true);
      }
    }

    async function submitPasswordUpdate() {
      const newPassword = (document.getElementById('new-password') || { value: '' }).value;
      const confirmPassword = (document.getElementById('confirm-password') || { value: '' }).value;

      if (!validateNewPasswordInputs(newPassword, confirmPassword)) return;

      try {
        setStatus('Updating password...');
        await runWithBusy([updatePasswordBtn], function () {
          return updatePassword(newPassword);
        });
        await signOut();

        window.history.replaceState({}, document.title, window.location.pathname + '?notice=password_changed');
        setLoginModeUi();
        setStatus('Password changed successfully. Please sign in with your new password.');
      } catch (err) {
        console.error('Update password error:', err);
        setStatus(mapAuthError(err, 'update-password'), true);
      }
    }

    signInBtn.addEventListener('click', submitSignIn);
    forgotPasswordBtn.addEventListener('click', submitForgotPassword);
    updatePasswordBtn.addEventListener('click', submitPasswordUpdate);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitSignIn();
    });

    signOutBtn.addEventListener('click', async function () {
      try {
        await signOut();
        setStatus('Signed out.');
        await refreshUserView(client);
      } catch (err) {
        console.error('Sign out error:', err);
        setStatus(mapAuthError(err, 'signout'), true);
      }
    });

    client.auth.onAuthStateChange(function () {
      if (recoveryMode) {
        setRecoveryModeUi();
      } else {
        refreshUserView(client);
      }
    });

    if (authParams.error || authParams.errorCode || authParams.errorDescription) {
      const errorObject = {
        message: safeDecode(authParams.errorDescription || authParams.error || authParams.errorCode)
      };
      setStatus(mapAuthError(errorObject, 'recovery'), true);
      setLoginModeUi();
      return;
    }

    const noticeStatus = getStatusFromNotice(authParams);

    if (recoveryHint) {
      const user = await waitForRecoveryUser(client, 3, 350);
      if (user) {
        setRecoveryModeUi();
        setStatus('Recovery link verified. Set your new password.');
      } else {
        setLoginModeUi();
        setStatus(
          'This reset link is invalid or expired. Enter your email and request a new reset link. If this keeps happening, verify redirect URLs in Supabase Auth settings.',
          true
        );
      }
      return;
    }

    if (signupConfirmationHint) {
      await refreshUserView(client);
      clearAuthUrl('signup_confirmed');
      const confirmedUser = await getCurrentUser(client);
      if (confirmedUser) {
        setStatus('Email confirmed successfully. Your account is now active.');
      } else {
        setStatus('Email confirmed successfully. Please sign in.', false);
      }
      return;
    }

    setLoginModeUi();
    await refreshUserView(client);
    if (noticeStatus) {
      setStatus(noticeStatus.text, noticeStatus.isError);
    }
  }

  async function initSignupPage() {
    const client = getClientOrStatus();
    wireShowPassword();
    if (!client) return;

    const form = document.getElementById('auth-form');
    const signUpBtn = document.getElementById('signup-btn');
    const signOutBtn = document.getElementById('signout-btn');

    if (!form || !signUpBtn || !signOutBtn) return;

    const authParams = parseAuthParams();
    const signupConfirmationHint = hasSignupConfirmationHint(authParams);

    async function submitSignUp() {
      const fullName = (document.getElementById('full-name') || { value: '' }).value.trim();
      const email = (document.getElementById('email') || { value: '' }).value.trim();
      const password = (document.getElementById('password') || { value: '' }).value;

      if (!validateCredentials(email, password)) return;
      if (!fullName) {
        setStatus('Please enter your full name.', true);
        return;
      }

      try {
        setStatus('Creating account...');
        const result = await runWithBusy([signUpBtn], function () {
          return signUp(fullName, email, password);
        });

        if (result && !result.session) {
          setStatus('Sign-up successful. Check your email to confirm, then sign in.');
        } else {
          setStatus('Sign-up successful and logged in.');
        }

        await refreshUserView(client);
      } catch (err) {
        console.error('Sign up error:', err);
        setStatus(mapAuthError(err, 'signup'), true);
      }
    }

    signUpBtn.addEventListener('click', submitSignUp);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitSignUp();
    });

    signOutBtn.addEventListener('click', async function () {
      try {
        await signOut();
        setStatus('Signed out.');
        await refreshUserView(client);
      } catch (err) {
        console.error('Sign out error:', err);
        setStatus(mapAuthError(err, 'signout'), true);
      }
    });

    client.auth.onAuthStateChange(function () {
      refreshUserView(client);
    });

    await refreshUserView(client);

    if (signupConfirmationHint) {
      clearAuthUrl('signup_confirmed');
      setStatus('Email confirmed successfully. Your account is now active.');
    }
  }

  async function initAccountSecurityPage() {
    const client = getClientOrStatus();
    wireShowPassword();
    if (!client) return;

    const userBox = document.getElementById('auth-user');
    const updatePasswordBtn = document.getElementById('update-password-btn');
    const signOutBtn = document.getElementById('signout-btn');
    const securityForm = document.getElementById('security-form');

    if (!userBox || !updatePasswordBtn || !signOutBtn || !securityForm) return;

    const user = await getCurrentUser(client);
    if (!user) {
      window.location.href = 'login.html?notice=login_required';
      return;
    }

    userBox.textContent = `Logged in as: ${getDisplayName(user)} (${user.email})`;

    async function submitPasswordUpdate() {
      const newPassword = (document.getElementById('new-password') || { value: '' }).value;
      const confirmPassword = (document.getElementById('confirm-password') || { value: '' }).value;

      if (!validateNewPasswordInputs(newPassword, confirmPassword)) return;

      try {
        setStatus('Updating password...');
        await runWithBusy([updatePasswordBtn], function () {
          return updatePassword(newPassword);
        });
        await signOut();
        window.location.href = 'login.html?notice=password_changed';
      } catch (err) {
        console.error('Account security password update error:', err);
        setStatus(mapAuthError(err, 'update-password'), true);
      }
    }

    updatePasswordBtn.addEventListener('click', submitPasswordUpdate);
    securityForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitPasswordUpdate();
    });

    signOutBtn.addEventListener('click', async function () {
      try {
        await signOut();
        window.location.href = 'login.html';
      } catch (err) {
        console.error('Sign out error:', err);
        setStatus(mapAuthError(err, 'signout'), true);
      }
    });
  }

  window.AuthUI = {
    initLoginPage,
    initSignupPage,
    initAccountSecurityPage,
    getDisplayName,
    mapAuthError
  };
})();
