// Configuración de Supabase - Reemplaza con tus credenciales
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

let supabase = null;

try {
    if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("Supabase inicializado correctamente.");
        } else {
            console.error("El SDK de Supabase no se cargó. Asegúrate de incluir la biblioteca de Supabase en el HTML.");
        }
    } else {
        console.warn("Credenciales de Supabase pendientes de configuración en supabase-config.js. Usando fallback de datos locales.");
    }
} catch (error) {
    console.error("Error al inicializar Supabase:", error);
}
