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


    flowchart LR
    subgraph Usuario["👤 Usuario"]
        REG["Registro"]
        LOGIN["Login"]
        REPORTE["Enviar Reporte"]
    end

    subgraph Sistema["⚙️ Sistema SITAC VEN"]
        AUTH["Autenticación"]
        MAPA["Mapa Táctico"]
        ADMIN["Panel Admin"]
        DB_LOCAL["Datos Locales"]
    end

    subgraph Cloud["☁️ Cloud"]
        FIREBASE_DB["Firebase RTDB"]
        EMAIL["EmailJS"]
        TELEGRAM_BOT["Telegram Bot"]
    end

    REG -->|Solicitud| AUTH
    LOGIN -->|Credenciales| AUTH
    AUTH -->|Verificar| FIREBASE_DB
    AUTH -->|Aprobación| EMAIL
    
    MAPA -->|Marcadores| FIREBASE_DB
    MAPA -->|Actualización| DB_LOCAL
    FIREBASE_DB -->|Cambios| MAPA
    
    ADMIN -->|Gestionar| FIREBASE_DB
    ADMIN -->|Aprobar| EMAIL
    
    REPORTE -->|Enviar| FIREBASE_DB
    FIREBASE_DB -->|Notificar| TELEGRAM_BOT
    TELEGRAM_BOT -->|Alerta| ADMIN

    style Usuario fill:#1a2332,stroke:#fbbf24,color:#fff
    style Sistema fill:#0f172a,stroke:#3b82f6,color:#fff
    style Cloud fill:#0f172a,stroke:#4ade80,color:#fff

    flowchart TB
    subgraph Frontend["🎨 Frontend (HTML/CSS/JS)"]
        UI["Interfaz de Usuario"]
        MAP["Mapa Interactivo"]
        CONSOLE["Consola de Operaciones"]
        COMPASS["Brújula Táctica"]
        MODALS["Sistema de Modales"]
    end

    subgraph Logica["🧠 Lógica de Negocio (script.js)"]
        AUTH_LOGIC["Autenticación"]
        MARKER_LOGIC["Gestión de Marcadores"]
        MOVE_LOGIC["Animación de Movimiento"]
        REPORT_LOGIC["Sistema de Reportes"]
        STATS_LOGIC["Estadísticas"]
    end

    subgraph Data["💾 Capa de Datos"]
        CONFIG_LOCAL["config.js (Local)"]
        FIREBASE_CONNECT["Firebase Connector"]
        SESSION["Session Storage"]
    end

    UI --> AUTH_LOGIC
    UI --> MARKER_LOGIC
    UI --> REPORT_LOGIC
    
    MAP --> MARKER_LOGIC
    MAP --> MOVE_LOGIC
    
    MARKER_LOGIC --> FIREBASE_CONNECT
    MOVE_LOGIC --> FIREBASE_CONNECT
    REPORT_LOGIC --> FIREBASE_CONNECT
    
    AUTH_LOGIC --> CONFIG_LOCAL
    AUTH_LOGIC --> SESSION
    
    FIREBASE_CONNECT --> CONFIG_LOCAL

    style Frontend fill:#1a2332,stroke:#fbbf24,color:#fff
    style Logica fill:#0f172a,stroke:#3b82f6,color:#fff
    style Data fill:#0f172a,stroke:#4ade80,color:#fff

    flowchart LR
    subgraph Dev["💻 Desarrollo Local"]
        CODE["Código Fuente"]
        VSCODE["VS Code"]
        GIT["Git"]
    end

    subgraph GitHub["🐙 GitHub"]
        REPO["Repositorio"]
        ACTIONS["GitHub Actions"]
        PR["Pull Request"]
    end

    subgraph CloudDeploy["☁️ Producción"]
        VERCEL["Vercel"]
        FIREBASE_PROD["Firebase"]
    end

    CODE -->|Commit| GIT
    GIT -->|Push| REPO
    REPO -->|PR| ACTIONS
    ACTIONS -->|Validar| PR
    PR -->|Aprobar| VERCEL
    VERCEL -->|Desplegar| FIREBASE_PROD

    style Dev fill:#1a2332,stroke:#fbbf24,color:#fff
    style GitHub fill:#0f172a,stroke:#3b82f6,color:#fff
    style CloudDeploy fill:#0f172a,stroke:#4ade80,color:#fff