(function () {
  let client = null;

  function isConfigured() {
    const url = window.SUPABASE_URL || '';
    const key = window.SUPABASE_ANON_KEY || '';
    const hasRealUrl = /^https:\/\/.+\.supabase\.co$/.test(url);
    const hasRealKey = key.length > 20;
    return Boolean(hasRealUrl && hasRealKey && window.supabase);
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!client) {
      client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
    return client;
  }

  window.SupabaseClient = {
    isConfigured,
    getClient
  };
})();
