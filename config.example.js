// ============================================================
// ===== CONFIGURACIÓN DE PRODUCCIÓN =====
// ============================================================
// Este archivo se genera automáticamente en el despliegue
// Las variables vienen del entorno (Vercel/Netlify)

// Detectar si estamos en producción
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

// Variables de entorno (inyectadas por Vercel/Netlify)
const ENV = {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || '',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || '',
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '',
    CHAT_ID: process.env.CHAT_ID || ''
};

// Validar que todas las variables estén configuradas
const requiredVars = ['FIREBASE_API_KEY', 'FIREBASE_DATABASE_URL', 'FIREBASE_PROJECT_ID'];
const missingVars = requiredVars.filter(key => !ENV[key]);

if (missingVars.length > 0 && isProduction) {
    console.error('❌ ERROR CRÍTICO: Variables de entorno faltantes:', missingVars);
    document.body.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #0a0c0f;
            color: #ef4444;
            font-family: 'Inter', sans-serif;
            padding: 20px;
            text-align: center;
        ">
            <div>
                <div style="font-size: 60px; margin-bottom: 20px;">🔒</div>
                <h1 style="font-size: 24px; margin-bottom: 10px;">Error de Configuración</h1>
                <p style="color: #94a3b8; max-width: 500px;">
                    El sistema no está configurado correctamente.<br>
                    Variables faltantes: ${missingVars.join(', ')}
                </p>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
                    Contacta al administrador del sistema.
                </p>
            </div>
        </div>
    `;
    throw new Error('Missing environment variables: ' + missingVars.join(', '));
}

// Configuración final
window.FIREBASE_CONFIG = {
    apiKey: ENV.FIREBASE_API_KEY,
    authDomain: ENV.FIREBASE_AUTH_DOMAIN,
    databaseURL: ENV.FIREBASE_DATABASE_URL,
    projectId: ENV.FIREBASE_PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID,
    measurementId: ENV.FIREBASE_MEASUREMENT_ID
};

window.TELEGRAM_TOKEN = ENV.TELEGRAM_TOKEN;
window.CHAT_ID = ENV.CHAT_ID;

console.log('✅ Configuración de producción cargada');