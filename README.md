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











# SITAC VEN - Sistema de Inteligencia Táctica

## 📌 Descripción
Sistema de comando y control para despliegue táctico de unidades militares en territorio venezolano. Permite visualizar en un mapa interactivo la ubicación de activos aliados y enemigos en tiempo real.

## 🛠️ Tecnologías utilizadas
- HTML5 / CSS3 / JavaScript
- Leaflet (mapas interactivos)
- Firebase Realtime Database (base de datos en tiempo real)
- EmailJS (notificaciones por correo)

## ⚙️ Instalación y ejecución
1. Clonar el repositorio:

git clone [https://github.com/joserevilla371-netizen/SITAC-VEN]


2. Abrir el archivo `index.html` en el navegador

## 🔐 Accesos
- **Usuario normal**: Registrarse y esperar aprobación del administrador
- **Administrador**: Credenciales predefinidas (contactar al desarrollador)

## 📁 Estructura del proyecto

├── index.html # Interfaz principal
├── script.js # Lógica del sistema
├── style.css # Estilos y diseño
├── package.json # Dependencias
└── assets/ # Imágenes y recursos
└── logo.png # Logo del sistema


## 👤 Autor
[NOMBRE COMPLETO] - [CORREO O CONTACTO]