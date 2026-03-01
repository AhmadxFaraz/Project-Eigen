(function () {
  let lastError = '';

  function setLastError(message) {
    lastError = message || '';
  }

  async function getUser() {
    try {
      const client = window.SupabaseClient && window.SupabaseClient.getClient();
      if (!client) {
        setLastError('Supabase client not configured.');
        return null;
      }

      const sessionResult = await client.auth.getSession();
      const sessionUser = sessionResult && sessionResult.data && sessionResult.data.session
        ? sessionResult.data.session.user
        : null;
      if (sessionUser) return sessionUser;

      const userResult = await client.auth.getUser();
      return userResult && userResult.data && userResult.data.user ? userResult.data.user : null;
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      setLastError(`Auth user fetch failed: ${msg}`);
      console.error('Auth user fetch failed:', msg);
      return null;
    }
  }

  async function pull(storageKey) {
    const client = window.SupabaseClient && window.SupabaseClient.getClient();
    if (!client) return null;

    const user = await getUser();
    if (!user) return null;

    const { data, error } = await client
      .from('tracker_progress')
      .select('data,updated_at')
      .eq('user_id', user.id)
      .eq('storage_key', storageKey)
      .maybeSingle();

    if (error) {
      setLastError(`Cloud pull failed: ${error.message}`);
      console.error('Cloud pull failed:', error.message);
      return null;
    }

    if (!data) {
      setLastError('');
      return null;
    }
    setLastError('');
    return {
      data: data.data,
      updatedAt: data.updated_at || null
    };
  }

  async function push(storageKey, trackerData) {
    const client = window.SupabaseClient && window.SupabaseClient.getClient();
    if (!client) {
      setLastError('Supabase client not configured.');
      return false;
    }

    const user = await getUser();
    if (!user) {
      setLastError('No signed-in user found on this page.');
      return false;
    }

    const { error } = await client.from('tracker_progress').upsert(
      {
        user_id: user.id,
        storage_key: storageKey,
        data: trackerData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,storage_key' }
    );

    if (error) {
      setLastError(`Cloud push failed: ${error.message}`);
      console.error('Cloud push failed:', error.message);
      return false;
    }

    setLastError('');
    return true;
  }

  window.TrackerCloud = {
    pull,
    push,
    getUser,
    getLastError: function () {
      return lastError;
    }
  };
})();
