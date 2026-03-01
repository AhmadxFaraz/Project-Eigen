(function () {
  let client = null;

  function getConfig() {
    return {
      url: String(window.SUPABASE_URL || '').trim(),
      key: String(window.SUPABASE_ANON_KEY || '').trim()
    };
  }

  function isConfigured() {
    const config = getConfig();
    const hasRealUrl = /^https:\/\/.+\.supabase\.co$/.test(config.url);
    const hasRealKey = config.key.length > 20;
    return Boolean(hasRealUrl && hasRealKey && window.supabase);
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!client) {
      const config = getConfig();
      client = window.supabase.createClient(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'prep-tracker-auth-v1'
        }
      });
    }
    return client;
  }

  window.SupabaseClient = {
    isConfigured,
    getClient
  };
})();
