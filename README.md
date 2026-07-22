# 🛡️ SITAC VEN - Sistema de Inteligencia Táctica

> Sistema de comando y control para despliegue táctico de unidades militares en territorio venezolano.

---

## 📐 ARQUITECTURA DEL SISTEMA

### 1. Diagrama de Arquitectura General

```mermaid
flowchart TB
    subgraph Cliente["🖥️ Cliente (Navegador)"]
        HTML["index.html"]
        CSS["style.css"]
        JS["script.js"]
        CONFIG["config.js"]
    end

    subgraph Servicios["☁️ Servicios en la Nube"]
        FIREBASE["🔥 Firebase Realtime DB"]
        EMAILJS["📧 EmailJS"]
        TELEGRAM["📱 Telegram Bot"]
    end

    subgraph Mapas["🗺️ Servicios de Mapas"]
        LEAFLET["🍃 Leaflet.js"]
        OSM["🌍 OpenStreetMap"]
        SATELITE["🛰️ ArcGIS Satellite"]
    end

    Cliente -->|Lectura/Escritura| FIREBASE
    Cliente -->|Envío de correos| EMAILJS
    Cliente -->|Notificaciones| TELEGRAM
    Cliente -->|Renderizado| LEAFLET
    LEAFLET -->|Capas| OSM
    LEAFLET -->|Capas| SATELITE

    style Cliente fill:#1a2332,stroke:#fbbf24,color:#fff
    style Servicios fill:#0f172a,stroke:#3b82f6,color:#fff
    style Mapas fill:#0f172a,stroke:#4ade80,color:#fff