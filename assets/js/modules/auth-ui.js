(function () {
  function setStatus(text, isError) {
    const el = document.getElementById('auth-status');
    if (!el) return;
    el.textContent = text;
    el.className = isError ? 'text-red-400 text-sm mt-3' : 'text-emerald-300 text-sm mt-3';
  }

  async function signIn(email, password) {
    const client = window.SupabaseClient.getClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(email, password) {
    const client = window.SupabaseClient.getClient();
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const client = window.SupabaseClient.getClient();
    await client.auth.signOut();
  }

  async function refreshUserView() {
    const userBox = document.getElementById('auth-user');
    const actions = document.getElementById('auth-actions');
    const form = document.getElementById('auth-form');
    if (!userBox || !actions || !form) return;

    const user = await window.TrackerCloud.getUser();
    if (user) {
      userBox.textContent = `Logged in as: ${user.email}`;
      actions.classList.remove('hidden');
      form.classList.add('hidden');
    } else {
      userBox.textContent = 'Not logged in';
      actions.classList.add('hidden');
      form.classList.remove('hidden');
    }
  }

  async function initAuthPage() {
    if (!window.SupabaseClient.isConfigured()) {
      setStatus('Set valid SUPABASE_URL + SUPABASE_ANON_KEY in assets/js/supabase-config.js', true);
      return;
    }

    const form = document.getElementById('auth-form');
    const signInBtn = document.getElementById('signin-btn');
    const signUpBtn = document.getElementById('signup-btn');
    const signOutBtn = document.getElementById('signout-btn');

    if (!form || !signInBtn || !signUpBtn || !signOutBtn) return;

    async function submit(mode, handler) {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      if (!email || !password) {
        setStatus('Email and password are required.', true);
        return;
      }

      if (password.length < 6) {
        setStatus('Password must be at least 6 characters.', true);
        return;
      }

      try {
        const result = await handler(email, password);
        if (mode === 'signup' && result && !result.session) {
          setStatus('Signup successful. Check your email inbox to confirm, then sign in.');
        } else if (mode === 'signin') {
          setStatus('Signed in successfully.');
        } else {
          setStatus('Success.');
        }
        await refreshUserView();
      } catch (err) {
        setStatus(err.message || 'Auth failed.', true);
      }
    }

    signInBtn.addEventListener('click', function () {
      submit('signin', signIn);
    });

    signUpBtn.addEventListener('click', function () {
      submit('signup', signUp);
    });

    signOutBtn.addEventListener('click', async function () {
      await signOut();
      setStatus('Signed out.');
      await refreshUserView();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit('signin', signIn);
    });

    const client = window.SupabaseClient.getClient();
    client.auth.onAuthStateChange(function () {
      refreshUserView();
    });

    refreshUserView();
  }

  window.AuthUI = {
    initAuthPage
  };
})();
