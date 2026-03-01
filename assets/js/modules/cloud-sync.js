(function () {
  async function getUser() {
    try {
      const client = window.SupabaseClient && window.SupabaseClient.getClient();
      if (!client) return null;

      const sessionResult = await client.auth.getSession();
      const sessionUser = sessionResult && sessionResult.data && sessionResult.data.session
        ? sessionResult.data.session.user
        : null;
      if (sessionUser) return sessionUser;

      const userResult = await client.auth.getUser();
      return userResult && userResult.data && userResult.data.user ? userResult.data.user : null;
    } catch (err) {
      console.error('Auth user fetch failed:', err && err.message ? err.message : err);
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
      console.error('Cloud pull failed:', error.message);
      return null;
    }

    if (!data) return null;
    return {
      data: data.data,
      updatedAt: data.updated_at || null
    };
  }

  async function push(storageKey, trackerData) {
    const client = window.SupabaseClient && window.SupabaseClient.getClient();
    if (!client) return false;

    const user = await getUser();
    if (!user) return false;

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
      console.error('Cloud push failed:', error.message);
      return false;
    }

    return true;
  }

  window.TrackerCloud = {
    pull,
    push,
    getUser
  };
})();
