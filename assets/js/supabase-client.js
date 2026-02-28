(function () {
  let client = null;

  function isConfigured() {
    return Boolean(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase);
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
