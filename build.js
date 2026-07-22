// ============================================================
// ===== SCRIPT DE CONSTRUCCIÓN =====
// ============================================================
// Este script genera la versión de producción del sistema

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando construcción del artefacto...');

// Leer variables de entorno
const env = process.env;

// Generar config.production.js
const configContent = `
// ============================================================
// ===== CONFIGURACIÓN DE PRODUCCIÓN (GENERADA AUTOMÁTICAMENTE) =====
// ============================================================
// ⚠️ NO EDITAR ESTE ARCHIVO - SE REGENERA EN CADA DESPLIEGUE

window.FIREBASE_CONFIG = {
    apiKey: "${env.FIREBASE_API_KEY || ''}",
    authDomain: "${env.FIREBASE_AUTH_DOMAIN || ''}",
    databaseURL: "${env.FIREBASE_DATABASE_URL || ''}",
    projectId: "${env.FIREBASE_PROJECT_ID || ''}",
    storageBucket: "${env.FIREBASE_STORAGE_BUCKET || ''}",
    messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID || ''}",
    appId: "${env.FIREBASE_APP_ID || ''}",
    measurementId: "${env.FIREBASE_MEASUREMENT_ID || ''}"
};

window.TELEGRAM_TOKEN = "${env.TELEGRAM_TOKEN || ''}";
window.CHAT_ID = "${env.CHAT_ID || ''}";

console.log('✅ Configuración de producción cargada');
`;

// Escribir archivo
try {
    fs.writeFileSync('config.production.js', configContent);
    console.log('✅ config.production.js generado');
    
    // Verificar que las variables estén configuradas
    const requiredVars = ['FIREBASE_API_KEY', 'FIREBASE_DATABASE_URL'];
    const missing = requiredVars.filter(v => !env[v]);
    
    if (missing.length > 0) {
        console.warn('⚠️ Advertencia: Variables de entorno faltantes:', missing.join(', '));
        console.warn('⚠️ El sistema puede no funcionar correctamente en producción');
    } else {
        console.log('✅ Todas las variables de entorno están configuradas');
    }
    
} catch (error) {
    console.error('❌ Error generando config.production.js:', error);
    process.exit(1);
}

console.log('✅ Construcción completada');