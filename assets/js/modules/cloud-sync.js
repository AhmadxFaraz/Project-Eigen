(function () {
  async function getUser() {
    const client = window.SupabaseClient && window.SupabaseClient.getClient();
    if (!client) return null;
    const { data } = await client.auth.getUser();
    return data && data.user ? data.user : null;
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
    if (!client) return;

    const user = await getUser();
    if (!user) return;

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
    }
  }

  window.TrackerCloud = {
    pull,
    push,
    getUser
  };
})();
