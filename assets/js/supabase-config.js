// Fill these with your Supabase project values.
// Example:
// window.SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
// window.SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
import os
window.SUPABASE_URL = os.environ.get("URL");
window.SUPABASE_ANON_KEY = os.environ.get("API_KEY");
