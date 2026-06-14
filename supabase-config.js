// Configuración de Supabase - Reemplaza con tus credenciales
let SUPABASE_URL = "ewxxjintjcwvlxaibnvx";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eHhqaW50amN3dmx4YWlibnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzOTIyNTMsImV4cCI6MjA5Njk2ODI1M30.AkwOz9R7WfNR7edjh37uciUgN-6o4QP7WwCzVnILr9c";

// Normalizar la URL de Supabase si solo ingresó el ID de referencia del proyecto
if (SUPABASE_URL && !SUPABASE_URL.startsWith("http://") && !SUPABASE_URL.startsWith("https://") && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
    SUPABASE_URL = `https://${SUPABASE_URL}.supabase.co`;
}

let supabaseClient = null;

try {
    if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("Supabase cliente inicializado correctamente.");
        } else {
            console.error("El SDK de Supabase no se cargó. Asegúrate de incluir la biblioteca de Supabase en el HTML.");
        }
    } else {
        console.warn("Credenciales de Supabase pendientes de configuración.");
    }
} catch (error) {
    console.error("Error al inicializar Supabase:", error);
}
