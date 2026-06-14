const firebaseConfig = {
    apiKey: "AIzaSyB6_AyF5fm4Lp4o9qcenSXjBVLCheo5zVM",
    authDomain: "sitac-ven-5f4c5.firebaseapp.com",
    databaseURL: "https://sitac-ven-5f4c5-default-rtdb.firebaseio.com",
    projectId: "sitac-ven-5f4c5",
    storageBucket: "sitac-ven-5f4c5.firebasestorage.app",
    messagingSenderId: "591770629715",
    appId: "1:591770629715:web:a06df0a310d957e66a38a6",
    measurementId: "G-9RW7HYGV11"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const TELEGRAM_TOKEN = "8999344580:AAHs_rdFtbSamjQ19PxjhBJBLgCINWCMkkM";
const CHAT_ID = "8075741065";

let pendingMoveMarkerId = null;
let tempSearchMarker = null;

function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

function addLog(msg) {
    const b = document.getElementById('console-body');
    if (!b) return;
    b.innerHTML += `<div>> ${new Date().toLocaleTimeString()} | ${escapeHTML(msg)}</div>`;
    b.scrollTop = b.scrollHeight;
}

function truncarTexto(texto, maxLength = 25) {
    if (!texto) return 'N/A';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

function showTacticalAlert(titulo, mensaje, icono = "⚠️", colorBorde = "#ef4444") {
    const alertTitle = document.getElementById('alert-tactical-title');
    const alertMsg = document.getElementById('alert-tactical-message');
    const alertIcon = document.getElementById('alert-tactical-icon');
    const frame = document.querySelector('.alert-frame');
    const btnContainer = document.getElementById('alert-tactical-buttons');
    
    if (alertTitle) alertTitle.innerText = titulo;
    if (alertTitle) alertTitle.style.color = colorBorde;
    if (alertMsg) alertMsg.innerText = mensaje;
    if (alertIcon) alertIcon.innerText = icono;
    
    if (frame) {
        frame.style.setProperty('border', `2px solid ${colorBorde}`, 'important');
        frame.style.setProperty('box-shadow', `0 0 35px ${colorBorde}40`, 'important');
    }
    
    if (btnContainer) {
        btnContainer.innerHTML = `<button class="btn-highlight" style="width: 140px; background:${colorBorde} !important; color:${colorBorde === '#fbbf24' ? '#000' : '#fff'} !important; margin: 0;" onclick="closeTacticalAlert()">ENTERADO</button>`;
    }
    
    const modal = document.getElementById('modal-alerta-tactica');
    if (modal) modal.style.display = "block";
}

function showTacticalConfirm(titulo, mensaje, onConfirm, onCancel = null, icono = "🚨") {
    const alertTitle = document.getElementById('alert-tactical-title');
    const alertMsg = document.getElementById('alert-tactical-message');
    const alertIcon = document.getElementById('alert-tactical-icon');
    const frame = document.querySelector('.alert-frame');
    const btnContainer = document.getElementById('alert-tactical-buttons');
    
    if (alertTitle) alertTitle.innerText = titulo;
    if (alertTitle) alertTitle.style.color = "#ef4444";
    if (alertMsg) alertMsg.innerText = mensaje;
    if (alertIcon) alertIcon.innerText = icono;
    if (frame) frame.style.setProperty('border', `2px solid #ef4444`, 'important');
    
    if (btnContainer) {
        btnContainer.innerHTML = `
        <button class="btn-danger-outline" style="width: 110px; margin: 0; padding:8px;" id="btn-tactical-cancel">CANCELAR</button>
        <button class="btn-highlight" style="width: 110px; margin: 0; padding:8px; background:#ef4444 !important; color:#fff !important;" id="btn-tactical-execute">EJECUTAR</button>
        `;
    }
    
    const executeBtn = document.getElementById('btn-tactical-execute');
    if (executeBtn) {
        executeBtn.onclick = function() {
            closeTacticalAlert();
            if (onConfirm) onConfirm();
        };
    }
    
    const cancelBtn = document.getElementById('btn-tactical-cancel');
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            closeTacticalAlert();
            if (onCancel) onCancel();
        };
    }
    
    const modal = document.getElementById('modal-alerta-tactica');
    if (modal) modal.style.display = "block";
}

function closeTacticalAlert() {
    const modal = document.getElementById('modal-alerta-tactica');
    if (modal) modal.style.display = "none";
}

function openModal(id) { 
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

function closeModals() { 
    document.querySelectorAll('.modal').forEach(m => { 
        if (m.id !== 'modal-alerta-tactica') m.style.display = "none"; 
    }); 
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

const venezuelaBounds = [[0.65, -73.5], [15.8, -58.5]];

const capaOscura = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
    crossOrigin: true,
    minZoom: 6,
    maxZoom: 18
});

const satelitalBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    crossOrigin: true, 
    attribution: false,
    minZoom: 6,
    maxZoom: 18
});

const satelitalCalles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', { 
    crossOrigin: true, 
    attribution: false 
});

const satelitalEtiquetas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { 
    crossOrigin: true, 
    attribution: false 
});

const capaSatelitalHibrida = L.layerGroup([satelitalBase, satelitalCalles, satelitalEtiquetas]);

const map = L.map('map', {
    zoomControl: false, 
    attributionControl: false, 
    maxBounds: venezuelaBounds, 
    maxBoundsViscosity: 1.0, 
    minZoom: 6,
    layers: [capaOscura], 
    rotate: true, 
    rotateControl: false, 
    bearing: 0, 
    touchRotate: true, 
    shiftTools: true
}).setView([10.4806, -66.8983], 7);

map.setMaxBounds(venezuelaBounds);
map.on('drag', function() {
    map.panInsideBounds(venezuelaBounds, { animate: false });
});

async function obtenerPaisDesdeCoordenadas(lat, lng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.address && data.address.country) {
            return data.address.country;
        }
        return null;
    } catch (error) {
        console.error("Error al obtener país:", error);
        return null;
    }
}

function validarDespliegueConAPI(lat, lng, unidad, tipo, componente, cantidad, config) {
    showTacticalAlert("VERIFICANDO UBICACIÓN", "Consultando base de datos geográfica para validar la jurisdicción...", "🔍", "#38bdf8");
    
    obtenerPaisDesdeCoordenadas(lat, lng).then(pais => {
        if (pais === "Venezuela") {
            db.ref('mision_activa/puntos').push({
                lat: lat,
                lng: lng,
                info: config,
                timestamp: Date.now()
            }).then(() => {
                addLog(`✅ DESPLIEGUE: ${cantidad} x ${unidad} (${tipo}) en [${lat}, ${lng}] - Venezuela`);
                showTacticalAlert("ORDEN EJECUTADA", "Activo desplegado en territorio venezolano.", "✅", "#4ade80");
                closeModals();
                if (tipo === 'ALIADO') {
                    document.getElementById('aliado-coordenada').value = '';
                } else {
                    document.getElementById('enemigo-coordenada').value = '';
                }
            }).catch(err => {
                showTacticalAlert("ERROR", "No se pudo registrar el activo.", "❌", "#ef4444");
            });
        } else {
            const mensaje = pais 
                ? `🌍 Ubicación detectada: ${pais}\n\n⛔ OPERACIÓN CANCELADA: Solo se permiten operaciones dentro del territorio venezolano.`
                : `⛔ OPERACIÓN CANCELADA: No se pudo verificar la ubicación. Solo se permiten operaciones dentro de Venezuela.`;
            showTacticalAlert("FUERA DE JURISDICCIÓN", mensaje, "🚫", "#ef4444");
            addLog(`❌ DENEGADO: Intento de despliegue en [${lat}, ${lng}] - País: ${pais || "Desconocido"}`);
        }
    }).catch(error => {
        showTacticalAlert("ERROR DE VERIFICACIÓN", "No se pudo validar la ubicación. Verifique su conexión a Internet.", "❌", "#ef4444");
        addLog(`❌ ERROR: No se pudo validar coordenadas [${lat}, ${lng}]`);
    });
}

function estaEnAgua(lat, lng) {
    const zonasAgua = [
        { minLat: 9.5, maxLat: 11.2, minLng: -71.8, maxLng: -70.5 },
        { minLat: 10.5, maxLat: 12.5, minLng: -72.5, maxLng: -59.5, esMar: true },
        { minLat: 10.1, maxLat: 10.3, minLng: -67.7, maxLng: -67.5 },
        { minLat: 10.8, maxLat: 12.0, minLng: -72.0, maxLng: -70.8 },
        { minLat: 8.3, maxLat: 9.8, minLng: -62.0, maxLng: -60.0 }
    ];
    
    const esMarCercano = (
        (lat > 10.5 && lat < 12.5 && lng < -66.0 && lng > -73.0) ||
        (lat > 8.5 && lat < 11.0 && lng < -59.5 && lng > -63.0)
    );
    
    if (esMarCercano) return true;
    
    for (let zona of zonasAgua) {
        if (lat >= zona.minLat && lat <= zona.maxLat && 
            lng >= zona.minLng && lng <= zona.maxLng) {
            return true;
        }
    }
    return false;
}

const mapasBase = { "🗺️ Vista Táctica": capaOscura, "🛰️ Vista Satelital": capaSatelitalHibrida };
L.control.layers(mapasBase, null, { position: 'topright' }).addTo(map);

map.on('rotate', function() {
    let bearing = map.getBearing();
    if (bearing < 0) bearing += 360;
    const needle = document.getElementById('compass-needle');
    if (needle) needle.style.transform = `rotate(${-bearing - 45}deg)`;
    let cardinal = "N";
    if (bearing > 22.5 && bearing <= 67.5) cardinal = "NE";
    else if (bearing > 67.5 && bearing <= 112.5) cardinal = "E";
    else if (bearing > 112.5 && bearing <= 157.5) cardinal = "SE";
    else if (bearing > 157.5 && bearing <= 202.5) cardinal = "S";
    else if (bearing > 202.5 && bearing <= 247.5) cardinal = "SO";
    else if (bearing > 247.5 && bearing <= 292.5) cardinal = "O";
    else if (bearing > 292.5 && bearing <= 337.5) cardinal = "NO";
    const label = document.getElementById('compass-bearing');
    if (label) label.innerText = `RUMBO: ${Math.round(bearing)}° ${cardinal}`;
});

function resetMapOrientation() {
    map.setBearing(0);
    addLog("SISTEMA: Orientación reajustada al Norte Real (0°).");
}

map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    showTacticalAlert("COORDENADAS DEL PUNTO", `${lat}, ${lng}`, "📍", "#38bdf8");
    addLog(`CONSULTA: Coordenadas [${lat}, ${lng}]`);
});

function parsearCoordenadas(input) {
    const partes = input.split(',');
    if (partes.length !== 2) return null;
    
    let lat = parseFloat(partes[0].trim());
    let lng = parseFloat(partes[1].trim());
    
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
}

function buscarCoordenadas() {
    const input = document.getElementById('coord-search-input').value.trim();
    if (!input) {
        showTacticalAlert("CAMPO VACÍO", "Ingrese coordenadas (ej: 11.389886, -69.675880)", "⚠️", "#fbbf24");
        return;
    }
    
    const coords = parsearCoordenadas(input);
    if (!coords) {
        showTacticalAlert("FORMATO INCORRECTO", "Use formato: latitud, longitud (ej: 11.389886, -69.675880)", "⚠️", "#fbbf24");
        return;
    }
    
    showTacticalAlert("VERIFICANDO UBICACIÓN", "Consultando base de datos geográfica...", "🔍", "#38bdf8");
    
    obtenerPaisDesdeCoordenadas(coords.lat, coords.lng).then(pais => {
        if (pais === "Venezuela") {
            map.setView([coords.lat, coords.lng], 16);
            
            if (tempSearchMarker) {
                map.removeLayer(tempSearchMarker);
                tempSearchMarker = null;
            }
            
            const tempIcon = L.divIcon({
                html: `<div style="background: #fbbf24; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 15px rgba(251,191,36,0.8);"></div>`,
                className: 'temp-marker',
                iconSize: [20, 20]
            });
            
            tempSearchMarker = L.marker([coords.lat, coords.lng], { icon: tempIcon }).addTo(map);
            
            tempSearchMarker.bindPopup(`
                <div style="font-family: 'JetBrains Mono'; text-align: center;">
                    <b>📍 UBICACIÓN ENCONTRADA</b><br>
                    Lat: ${coords.lat}<br>
                    Lng: ${coords.lng}<br>
                    <i style="color: #4ade80;">✅ Dentro de Venezuela</i>
                </div>
            `).openPopup();
            
            setTimeout(() => {
                if (tempSearchMarker) {
                    map.removeLayer(tempSearchMarker);
                    tempSearchMarker = null;
                }
            }, 20000);
            
            addLog(`BÚSQUEDA: Navegando a [${coords.lat}, ${coords.lng}] con zoom 16`);
            showTacticalAlert("UBICACIÓN ENCONTRADA", `Centrando mapa en:\n${coords.lat}, ${coords.lng}\n✅ Dentro de Venezuela`, "🎯", "#4ade80");
        } else {
            const mensaje = pais 
                ? `🌍 Ubicación detectada: ${pais}\n\n⛔ Las coordenadas están fuera del territorio venezolano.`
                : `⛔ No se pudo verificar la ubicación. Asegúrese de estar conectado a Internet.`;
            showTacticalAlert("FUERA DE VENEZUELA", mensaje, "🚫", "#ef4444");
            addLog(`BÚSQUEDA: Coordenadas [${coords.lat}, ${coords.lng}] - País: ${pais || "Desconocido"} - FUERA DE VENEZUELA`);
        }
    }).catch(error => {
        showTacticalAlert("ERROR DE VERIFICACIÓN", "No se pudo validar la ubicación. Verifique su conexión a Internet.", "❌", "#ef4444");
        addLog(`❌ ERROR: No se pudo validar coordenadas [${coords.lat}, ${coords.lng}]`);
    });
}

const listaCompletaCuarteles = [
    { nombre: "Comando Estratégico Operacional (CEOFANB) - Fuerte Tiuna", componente: "Ejército Bolivariano", lat: 10.461934, lng: -66.897980 , icono: "🏰" },
    { nombre: "Batallón de Infantería Mecanizada Nro. 143 'Coronel Atanasio Girardot' - Coro", componente: "Ejército Bolivariano", lat: 11.392271, lng: -69.669407, icono: "🏰" },
    { nombre: "Comandancia General de la Armada", componente: "Armada Bolivariana", lat: 10.509596, lng: -66.899540, icono: "⚓" },
    { nombre: "Base Naval Juan Crisóstomo Falcón", componente: "Armada Bolivariana", lat: 11.703282, lng: -70.208201, icono: "⚓" },
    { nombre: "Comando Aéreo Estratégico - Base Aérea El Libertador SVBL", componente: "Aviación Militar Bolivariana", lat: 10.168557,  lng: -67.559290, icono: "✈️" },
    { nombre: "Base Aérea 'Capitan Manuel Ríos", componente: "Aviación Militar Bolivariana", lat: 9.373239, lng: -66.933042, icono: "✈️" },
    { nombre: "Base Aérea 'Teniente Vicente Landaeta Gil' - Barcelona", componente: "Aviación Militar Bolivariana", lat: 10.043896, lng: -69.368688, icono: "✈️" },
    { nombre: "Comando NACIONAL ANTIEXTORSION Y SECUESTRO", componente: "Guardia Nacional Bolivariana", lat: 10.460912, lng: -66.848279, icono: "🛡️" },
    { nombre: "Comando de Zona N° 33 - GNB", componente: "Guardia Nacional Bolivariana", lat: 8.634570, lng: -70.233735, icono: "🛡️" },
    { nombre: "Comando General de la Milicia", componente: "Milicia Bolivariana", lat: 10.448848, lng: -66.909903, icono: "🏛️" },
    { nombre: "Area de Defensa Integral 1201 Coronel Tirso Salaverria", componente: "Milicia Bolivariana", lat: 11.392459 , lng: -69.671484, icono: "🏛️" },
    { nombre: "UNEFA - Núcleo Coro", componente: "UNEFA", lat: 11.389315, lng: -69.673550, icono: "🎓" },
    { nombre: "UNEFA - Extensión Punto Fijo", componente: "UNEFA", lat: 11.650505, lng: -70.220559, icono: "🎓" }
];

function agregarCuarteles() {
    listaCompletaCuarteles.forEach(c => {
        const iconoCuartel = L.divIcon({
            html: `<div style="background: #1e3a8a; border: 2px solid #fbbf24; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 0 15px rgba(251,191,36,0.5);">${c.icono}</div>`,
            className: 'cuartel-icon',
            iconSize: [32, 32]
        });
        
        const marker = L.marker([c.lat, c.lng], { icon: iconoCuartel }).addTo(map);
        marker.bindPopup(`
            <div style="font-family: 'JetBrains Mono', monospace; min-width: 200px;">
                <b style="color: #fbbf24; font-size: 14px;">🏢 ${c.nombre}</b><br>
                <hr style="margin: 5px 0; border: 0; border-top: 1px solid #334155;">
                <b>Componente:</b> ${c.componente}<br>
                <b>📍 Coordenadas:</b> ${c.lat}, ${c.lng}<br>
                <i style="color: #94a3b8;">Unidad táctica permanente</i>
            </div>
        `);
    });
    addLog(`SISTEMA: ${listaCompletaCuarteles.length} cuarteles cargados.`);
}

let userRole = "usuario";
let currentUserRank = "USUARIO ANÓNIMO";
window.activeMarkers = {};

const symbols = { "Tropas": "👥", "Tanques": "🚜", "Aviones": "✈️", "Barcos": "🚢", "Drones": "🛸", "Terrorista": "☣️", "Enfrentamiento": "💥", "Unidad Médica": "🏥" };

function confirmarDespliegueCoordenadas(tipo) {
    let componente, unidad, cantidad, coordenadaStr;
    
    if (tipo === 'ALIADO') {
        componente = document.getElementById('aliado-componente').value;
        unidad = document.getElementById('aliado-unidad').value;
        cantidad = parseInt(document.getElementById('aliado-cantidad-nueva').value) || 1;
        coordenadaStr = document.getElementById('aliado-coordenada').value;
    } else {
        componente = 'Hostil';
        unidad = document.getElementById('enemigo-unidad').value;
        cantidad = parseInt(document.getElementById('enemigo-cantidad-nueva').value) || 1;
        coordenadaStr = document.getElementById('enemigo-coordenada').value;
    }
    
    if (!coordenadaStr.trim()) {
        showTacticalAlert("COORDENADA REQUERIDA", "Debe ingresar las coordenadas del despliegue.", "⚠️", "#fbbf24");
        return;
    }
    
    const coords = parsearCoordenadas(coordenadaStr);
    if (!coords) {
        showTacticalAlert("FORMATO INCORRECTO", "Use formato: latitud, longitud (ej: 11.389886, -69.675880)", "⚠️", "#fbbf24");
        return;
    }
    
    if (unidad === "Barcos") {
        if (!estaEnAgua(coords.lat, coords.lng)) {
            showTacticalAlert("RESTRICCIÓN NAVAL", 
                "OPERACIÓN CANCELADA: Las unidades de BARCOS solo pueden desplegarse en áreas acuáticas.", 
                "🌊", "#fbbf24");
            return;
        }
    }
    
    const config = {
        faction: tipo,
        component: componente,
        asset: unidad,
        symbol: symbols[unidad] || "📍",
        cantidad: cantidad
    };
    
    showTacticalConfirm(
        "CONFIRMAR ORDEN DE DESPLIEGUE",
        `¿Ejecutar despliegue?\n\nBANDO: ${tipo}\nUNIDAD: ${unidad}\nCANTIDAD: ${cantidad}\nCOORDENADAS: ${coords.lat}, ${coords.lng}`,
        () => {
            validarDespliegueConAPI(coords.lat, coords.lng, unidad, tipo, componente, cantidad, config);
        },
        null,
        "🚨"
    );
}

function guardarSesion(rango, rol) {
    sessionStorage.setItem('sitac_sesion_rango', rango);
    sessionStorage.setItem('sitac_sesion_rol', rol);
    console.log("✅ SESIÓN GUARDADA - Rol:", rol, "Rango:", rango);
}

function cerrarSesion() {
    sessionStorage.removeItem('sitac_sesion_rango');
    sessionStorage.removeItem('sitac_sesion_rol');
    console.log("🚪 SESIÓN CERRADA");
    location.reload();
}

function handleRegistro() {
    const v_nombre = document.getElementById('reg-nombre').value;
    const v_apellido = document.getElementById('reg-apellido').value;
    const v_cedula = document.getElementById('reg-cedula').value;
    const v_grado = document.getElementById('reg-grado').value;
    const v_correo = document.getElementById('reg-correo') ? document.getElementById('reg-correo').value : "";
    const v_componente = document.getElementById('reg-componente').value;
    const v_pass = document.getElementById('reg-pass').value;

    if (!v_cedula || !v_pass || !v_nombre) {
        showTacticalAlert("CAMPOS INCOMPLETOS", "Error crítico: Datos de registro incompletos.", "⚠️", "#fbbf24");
        return;
    }

    const datos = {
        nombre: v_nombre, apellido: v_apellido, cedula: v_cedula,
        grado: v_grado, correo: v_correo, componente: v_componente,
        pass: v_pass, role: "usuario", aprobado: false
    };

    db.ref('usuarios_pendientes/' + v_cedula).set(datos)
        .then(() => {
            if (typeof emailjs !== 'undefined') {
                return emailjs.send("service_wm4ye18", "template_1600d5d", {
                    nombre: v_grado + " " + v_nombre + " " + v_apellido,
                    cedula: v_cedula, componente: v_componente, reply_to: "joserevilla371@gmail.com"
                });
            }
        })
        .then(() => {
            closeModals();
            showTacticalAlert("COMUNICACIÓN ENVIADA", "Solicitud de acceso transmitida. El Administrador ha sido notificado para la aprobación.", "📡", "#4ade80");
        })
        .catch((err) => {
            showTacticalAlert("ERROR DE RED", "No se pudo sincronizar el registro telemático.", "❌", "#ef4444");
        });
}

function handleLogin() {
    const cedula = document.getElementById('log-cedula').value;
    const pass = document.getElementById('log-pass').value;
    
    closeModals();
    
    if (cedula === "0000" && pass === "admin123") { 
        guardarSesion("ADMINISTRADOR SUPREMO", "admin");
        iniciarApp("ADMINISTRADOR SUPREMO", "admin"); 
        return; 
    }
    db.ref('usuarios_aprobados/' + cedula).once('value').then((snap) => {
        const user = snap.val();
        if (user && user.pass === pass) {
            guardarSesion(user.grado + " " + user.nombre, "usuario");
            iniciarApp(user.grado + " " + user.nombre, "usuario");
        } else {
            db.ref('usuarios_pendientes/' + cedula).once('value').then((p) => {
                if (p.exists()) {
                    showTacticalAlert("ACCESO RETENIDO", "Su cuenta está en la cola de aprobación del Puesto de Mando.", "⏳", "#fbbf24");
                } else {
                    showTacticalAlert("ACCESO RECHAZADO", "Credenciales incorrectas o usuario inexistente.", "🔐", "#ef4444");
                }
            });
        }
    });
}

function deponerPersonal(id, rutaNodo) {
    showTacticalConfirm("ELIMINAR MIEMBRO", `¿Confirma la baja y revocación absoluta de la C.I: ${id} del sistema central?`, () => {
        db.ref(`${rutaNodo}/${id}`).remove()
            .then(() => {
                addLog(`SEGURIDAD: Registro C.I ${id} eliminado del nodo [${rutaNodo}].`);
                showTacticalAlert("BAJA PROCESADA", "El usuario ha sido desvinculado con éxito.", "🗑️", "#fbbf24");
            });
    }, null, "⚠️");
}

function aprobarUsuarioPendiente(cedula) {
    showTacticalConfirm("APROBAR ACCESO", `¿Autorizar ingreso del personal con C.I: ${cedula} al sistema operacional?`, () => {
        db.ref('usuarios_pendientes/' + cedula).once('value').then((snap) => {
            const user = snap.val();
            if (user) {
                db.ref('usuarios_aprobados/' + cedula).set(user).then(() => {
                    db.ref('usuarios_pendientes/' + cedula).remove().then(() => {
                        addLog(`SEGURIDAD: Usuario C.I ${cedula} APROBADO e integrado al sistema.`);
                        showTacticalAlert("ACCESO CONCEDIDO", `El personal ha sido activado en el sistema.`, "✅", "#4ade80");
                        escucharRegistroPersonal();
                    });
                });
            } else {
                showTacticalAlert("ERROR", "No se encontraron datos del usuario pendiente.", "❌", "#ef4444");
            }
        });
    }, null, "🛡️");
}

function rechazarUsuarioPendiente(cedula) {
    showTacticalConfirm("RECHAZAR SOLICITUD", `¿Denegar y eliminar la solicitud de acceso de C.I: ${cedula}?`, () => {
        db.ref('usuarios_pendientes/' + cedula).remove().then(() => {
            addLog(`SEGURIDAD: Solicitud de C.I ${cedula} RECHAZADA y eliminada.`);
            showTacticalAlert("SOLICITUD DENEGADA", "El registro ha sido eliminado del sistema.", "❌", "#ef4444");
            escucharRegistroPersonal();
        });
    }, null, "⚠️");
}

function handleAdminLogin() {
    const cedula = document.getElementById('admin-log-cedula').value;
    const pass = document.getElementById('admin-log-pass').value;
    
    closeModals();
    
    if (cedula === "0000" && pass === "admin123") { 
        guardarSesion("ADMINISTRADOR SUPREMO", "admin");
        iniciarApp("ADMINISTRADOR SUPREMO", "admin"); 
        return; 
    }
    db.ref('administradores/' + cedula).once('value').then((snap) => {
        const admin = snap.val();
        if (admin && admin.pass === pass) {
            guardarSesion(admin.grado + " " + admin.nombre, "admin");
            iniciarApp(admin.grado + " " + admin.nombre, "admin");
        } else {
            db.ref('administradores_pendientes/' + cedula).once('value').then((p) => {
                if (p.exists()) {
                    showTacticalAlert("ACCESO EN COLISIÓN", "Falta Aprobación Móvil: Su rango se encuentra en revisión física en el teléfono del Comandante Supremo.", "🔒", "#ef4444");
                } else {
                    showTacticalAlert("DENEGADO", "Identificación de Mando Inválida o Inexistente.", "🔒", "#ef4444");
                }
            });
        }
    });
}

function handleAdminRegistro() {
    const cedula = document.getElementById('admin-reg-cedula').value;
    const nombre = document.getElementById('admin-reg-nombre').value;
    const apellido = document.getElementById('admin-reg-apellido').value;
    const grado = document.getElementById('admin-reg-grado').value;
    const correo = document.getElementById('admin-reg-correo').value;
    const componente = document.getElementById('admin-reg-componente').value;
    const pass = document.getElementById('admin-reg-pass').value;

    if (!cedula || !pass || !nombre || !apellido || !grado || !correo) {
        showTacticalAlert("REGISTRO FALLIDO", "Campos centrales de acceso de mando incompletos.", "⚠️", "#fbbf24");
        return;
    }

    const datos = { nombre, apellido, cedula, grado, correo, componente, pass, role: "admin", aprobado: false };
    db.ref('administradores_pendientes/' + cedula).set(datos)
        .then(() => {
            const mensajeTelegram = `🚨 *SOLICITUD DE MANDO SITAC VEN*\n\n` +
                `Un usuario requiere privilegios de *ADMINISTRADOR*:\n` +
                `• *Identificación:* ${grado} ${nombre} ${apellido}\n` +
                `• *C.I / Credencial:* ${cedula}\n` +
                `• *Componente:* ${componente}\n` +
                `• *Correo:* ${correo}\n\n` +
                `⚡ _Seleccione una acción inmediata desde este terminal:_`;

            const botonesInteractivos = {
                inline_keyboard: [[
                    { text: "🟢 APROBAR MANDO", callback_data: `approve_admin:${cedula}` },
                    { text: "🔴 RECHAZAR", callback_data: `reject_admin:${cedula}` }
                ]]
            };

            return fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: mensajeTelegram,
                    parse_mode: 'Markdown',
                    reply_markup: botonesInteractivos
                })
            });
        })
        .then(() => {
            closeModals();
            showTacticalAlert("TRANSMISIÓN PERIMETRAL", "Petición de comando enviada al dispositivo móvil del Administrador Supremo. Esperando aprobación directa por Telegram.", "📱", "#fbbf24");
            addLog(`SEGURIDAD: Alerta con botones interactivos enviada para CI: ${cedula}.`);
        })
        .catch(e => showTacticalAlert("ERROR DE CANAL", "Fallo crítico en el enlace telemático móvil.", "❌", "#ef4444"));
}

function enviarReporteMando() {
    const asunto = document.getElementById('rep-asunto').value;
    const mensaje = document.getElementById('rep-mensaje').value;
    if (!asunto || !mensaje) {
        showTacticalAlert("INFORME VACÍO", "Escriba el asunto y cuerpo antes de la transmisión.", "📝", "#fbbf24");
        return;
    }
    const report = { emisor: currentUserRank, asunto: asunto, mensaje: mensaje, fecha: new Date().toLocaleString() };
    db.ref('reportes_sistema').push(report)
        .then(() => {
            document.getElementById('rep-asunto').value = "";
            document.getElementById('rep-mensaje').value = "";
            closeModals();
            showTacticalAlert("ENVIADO", "Reporte transmitido por canal seguro.", "🚀", "#4ade80");
            addLog("COMUNICACIONES: Reporte enviado al puesto de comando central.");
        })
        .catch(e => showTacticalAlert("ERROR", "Fallo de enlace satelital.", "❌", "#ef4444"));
}

function escucharBuzonReportes() {
    db.ref('reportes_sistema').off();
    db.ref('reportes_sistema').on('value', (snapshot) => {
        const buzon = document.getElementById('admin-mailbox');
        const badge = document.getElementById('msg-count');
        const lista = snapshot.val();
        if (!lista) {
            if (buzon) buzon.innerHTML = `<div style="color:#6b7280; font-size:0.75rem; text-align:center; padding:20px;">Sin reportes nuevos</div>`;
            if (badge) badge.style.display = "none";
            return;
        }
        if (buzon) buzon.innerHTML = "";
        let totalMsg = 0;
        for (let key in lista) {
            totalMsg++;
            let r = lista[key];
            let card = document.createElement('div');
            card.className = "msg-card";
            card.innerHTML = `
            <div class="msg-meta">👤 De: ${escapeHTML(r.emisor)} | 📅 ${escapeHTML(r.fecha)}</div>
            <div style="font-weight:bold; color:#fbbf24; margin-bottom:5px;">📌 ASUNTO: ${escapeHTML(r.asunto)}</div>
            <div style="color:#f3f4f6; margin-bottom:8px; background:#111827; padding:10px; border:1px solid #374151;">${escapeHTML(r.mensaje)}</div>
            <button onclick="confirmarEliminar('${key}')" style="background:#ef4444; color:white; border:none; font-size:11px; padding:4px 8px; cursor:pointer;">Eliminar</button>
            `;
            if (buzon) buzon.prepend(card);
        }
        if (badge) {
            badge.innerText = totalMsg;
            badge.style.display = "inline-block";
        }
    });
}

function confirmarEliminar(key) {
    showTacticalConfirm("ELIMINAR REPORTE", "¿Desea eliminar definitivamente esta comunicación de seguridad del buzón activo?", () => {
        db.ref('reportes_sistema/' + key).remove();
    }, null, "🗑️");
}

function gestionarSolicitudes() {
    db.ref('usuarios_pendientes').once('value', (snapshot) => {
        const lista = snapshot.val();
        if (!lista) { showTacticalAlert("SIN ACCESOS", "No hay solicitudes de operadores pendientes en el sistema.", "📥", "#fbbf24"); return; }
        for (let id in lista) {
            let u = lista[id];
            showTacticalConfirm("REVISIÓN DE ACCESO OPERADOR", `¿Aprobar credenciales de entrada para:\n\n${u.grado} ${u.nombre}\nC.I: ${id}?`, () => {
                db.ref('usuarios_aprobados/' + id).set(u);
                db.ref('usuarios_pendientes/' + id).remove();
                addLog("SEGURIDAD: Usuario CI " + id + " aprobado.");
            }, null, "🛡️");
            return;
        }
    });
}

function escucharRegistroPersonal() {
    const tablaCuerpo = document.getElementById("db-cuerpo-tabla");
    const contadorRegistros = document.getElementById("db-counter");
    
    if (!tablaCuerpo) return;
    
    const refAprobados = db.ref('usuarios_aprobados');
    const refAdmins = db.ref('administradores');
    const refPendientes = db.ref('usuarios_pendientes');

    function renderizarPersonal() {
        Promise.all([refAdmins.once('value'), refAprobados.once('value'), refPendientes.once('value')]).then(([snapAdmins, snapAprobados, snapPendientes]) => {
            tablaCuerpo.innerHTML = "";
            const admins = snapAdmins.val() || {};
            const aprobados = snapAprobados.val() || {};
            const pendientes = snapPendientes.val() || {};
            
            let totalRegistros = 0;
            
            for (let id in admins) {
                totalRegistros++;
                let u = admins[id];
                let nombreCompleto = truncarTexto(`${u.nombre || ''} ${u.apellido || ''}`, 28);
                let correoTruncado = truncarTexto(u.correo || 'N/A', 22);
                let gradoTruncado = truncarTexto(u.grado || 'MANDO', 18);
                
                let fila = document.createElement('tr');
                fila.innerHTML = `
                    <td style="padding: 10px 8px; text-align: center;"><span style="background: #15803d; color: white; padding: 3px 8px; font-size: 0.7rem; font-weight: bold;">ACTIVO</span></td>
                    <td style="padding: 10px 8px; color: #fbbf24; font-weight: bold;">${escapeHTML(id)}</td>
                    <td style="padding: 10px 8px; color: #fff;">${escapeHTML(nombreCompleto)}</td>
                    <td style="padding: 10px 8px; color: #e2e8f0;">${escapeHTML(gradoTruncado)}</td>
                    <td style="padding: 10px 8px; color: #94a3b8;">${escapeHTML(correoTruncado)}</td>
                    <td style="padding: 10px 8px; color: #fbbf24;">${escapeHTML(u.componente || 'CONG')}</td>
                    <td style="padding: 10px 8px; text-align: center;"><span style="background: #fbbf24; color: #000; padding: 3px 8px; font-size: 0.65rem;">ADMIN</span></td>
                    <td style="padding: 10px 8px; text-align: center;">
                        <button onclick="deponerPersonal('${escapeHTML(id)}', 'administradores')" style="background: #ef4444; color: white; border: none; padding: 4px 10px; cursor: pointer;">ELIMINAR</button>
                    </td>
                `;
                tablaCuerpo.appendChild(fila);
            }
            
            for (let id in aprobados) {
                totalRegistros++;
                let u = aprobados[id];
                let nombreCompleto = truncarTexto(`${u.nombre || ''} ${u.apellido || ''}`, 28);
                let correoTruncado = truncarTexto(u.correo || 'N/A', 22);
                let gradoTruncado = truncarTexto(u.grado || 'OPERADOR', 18);
                
                let fila = document.createElement('tr');
                fila.innerHTML = `
                    <td style="padding: 10px 8px; text-align: center;"><span style="background: #2563eb; color: white; padding: 3px 8px; font-size: 0.7rem; font-weight: bold;">ACTIVO</span></td>
                    <td style="padding: 10px 8px; color: #fff;">${escapeHTML(id)}</td>
                    <td style="padding: 10px 8px; color: #94a3b8;">${escapeHTML(nombreCompleto)}</td>
                    <td style="padding: 10px 8px; color: #fff; font-weight: bold;">${escapeHTML(gradoTruncado)}</td>
                    <td style="padding: 10px 8px; color: #94a3b8;">${escapeHTML(correoTruncado)}</td>
                    <td style="padding: 10px 8px; color: #e2e8f0;">${escapeHTML(u.componente || 'FANB')}</td>
                    <td style="padding: 10px 8px; text-align: center;"><span style="background: #2563eb; color: white; padding: 3px 8px; font-size: 0.65rem;">OPERADOR</span></td>
                    <td style="padding: 10px 8px; text-align: center;">
                        <button onclick="deponerPersonal('${escapeHTML(id)}', 'usuarios_aprobados')" style="background: #ef4444; color: white; border: none; padding: 4px 10px; cursor: pointer;">ELIMINAR</button>
                    </td>
                `;
                tablaCuerpo.appendChild(fila);
            }
            
            for (let id in pendientes) {
                totalRegistros++;
                let u = pendientes[id];
                let nombreCompleto = truncarTexto(`${u.nombre || ''} ${u.apellido || ''}`, 28);
                let correoTruncado = truncarTexto(u.correo || 'N/A', 22);
                let gradoTruncado = truncarTexto(u.grado || 'N/E', 18);
                
                let fila = document.createElement('tr');
                fila.style.background = "rgba(251, 191, 36, 0.05)";
                fila.innerHTML = `
                    <td style="padding: 10px 8px; text-align: center;"><span style="background: #b45309; color: white; padding: 3px 8px; font-size: 0.7rem; font-weight: bold;">PENDIENTE</span></td>
                    <td style="padding: 10px 8px; color: #fbbf24; font-weight: bold;">${escapeHTML(id)}</td>
                    <td style="padding: 10px 8px; color: #94a3b8;">${escapeHTML(nombreCompleto)}</td>
                    <td style="padding: 10px 8px; color: #e2e8f0;">${escapeHTML(gradoTruncado)}</td>
                    <td style="padding: 10px 8px; color: #94a3b8;">${escapeHTML(correoTruncado)}</td>
                    <td style="padding: 10px 8px; color: #e2e8f0;">${escapeHTML(u.componente || 'N/E')}</td>
                    <td style="padding: 10px 8px; text-align: center;"><span style="background: #b45309; color: white; padding: 3px 8px; font-size: 0.65rem;">PENDIENTE</span></td>
                    <td style="padding: 10px 8px; text-align: center;">
                        <button onclick="aprobarUsuarioPendiente('${escapeHTML(id)}')" style="background: #15803d; color: white; border: none; padding: 4px 8px; cursor: pointer; margin-right: 4px;">APROBAR</button>
                        <button onclick="rechazarUsuarioPendiente('${escapeHTML(id)}')" style="background: #991b1b; color: white; border: none; padding: 4px 8px; cursor: pointer;">RECHAZAR</button>
                    </td>
                `;
                tablaCuerpo.appendChild(fila);
            }
            
            if (contadorRegistros) contadorRegistros.innerText = totalRegistros;
            
            if (totalRegistros === 0) {
                tablaCuerpo.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #6b7280;">📭 NO HAY PERSONAL REGISTRADO EN EL ARCHIVO CENTRAL</td></tr>`;
            }
        }).catch(error => {
            console.error("Error cargando datos:", error);
            tablaCuerpo.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #ef4444;">❌ ERROR AL CARGAR DATOS: ${error.message}</td></tr>`;
        });
    }
    
    refAprobados.off();
    refAdmins.off();
    refPendientes.off();
    refAprobados.on('value', renderizarPersonal);
    refAdmins.on('value', renderizarPersonal);
    refPendientes.on('value', renderizarPersonal);
}

function iniciarApp(rango, rol) {
    userRole = rol;
    currentUserRank = rango;
    const landing = document.getElementById('landing-page');
    const navbar = document.getElementById('navbar');
    const appContainer = document.getElementById('app-container');
    const userRankSpan = document.getElementById('user-display-rank');
    const adminPanel = document.getElementById('admin-panel');
    const btnReporte = document.getElementById('btn-envio-reporte');
    
    if (landing) landing.style.display = "none";
    if (navbar) navbar.style.display = "none";
    if (appContainer) appContainer.style.display = "flex";
    if (userRankSpan) userRankSpan.innerText = rango;
    
    if (rol === "admin") {
        if (adminPanel) adminPanel.style.display = "block";
        if (btnReporte) btnReporte.style.display = "none";
        escucharBuzonReportes();
    } else {
        if (adminPanel) adminPanel.style.display = "none";
        if (btnReporte) btnReporte.style.display = "block";
    }
    
    map.invalidateSize();
    agregarCuarteles();
    addLog("SISTEMA ONLINE. MODO: " + rol.toUpperCase());
    listenToCloud();
    escucharRegistroPersonal();
    showTacticalAlert("SISTEMA INICIALIZADO", `Bienvenido, enlace táctico establecido correctamente para: ${rango}`, "🛸", "#4ade80");
}

function createMarker(latlng, config, id) {
    if (window.activeMarkers[id]) return;
    const color = config.faction === 'ALIADO' ? '#4ade80' : '#ef4444';
    const cantidad = config.cantidad || 1;
    const displayCantidad = cantidad > 1 ? `x${cantidad}` : '';
    
    const icon = L.divIcon({
        html: `<div style="background:${color}; color:white; width:auto; min-width:30px; height:30px; border-radius:3px; display:flex; align-items:center; justify-content:center; border:1px solid #fff; font-size:16px; padding:0 6px;">${config.symbol} ${displayCantidad}</div>`,
        className: 'custom-icon', iconSize: [30 + (displayCantidad.length * 6), 30]
    });
    
    const marker = L.marker(latlng, { icon: icon }).addTo(map);
    
    let popupContent = `
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; min-width: 180px;">
    <b style="color:${color}; font-size: 14px;">${config.asset.toUpperCase()} ${displayCantidad}</b><br>
    <hr style="margin: 5px 0; border: 0; border-top: 1px solid #334155;">
    <b>BANDO:</b> ${config.faction}<br>
    <b>COMPONENTE:</b> ${config.component}<br>
    <b>CANTIDAD:</b> ${cantidad} unidad(es)<br>
    <b>COORDENADAS:</b> ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}
    </div>
    `;
    
    if (userRole === "admin" && id) {
        popupContent += `<button onclick="deleteMarker('${id}')" style="background:#ef4444; color:white; border:none; padding:5px; cursor:pointer; margin-top:8px; width:100%; border-radius:3px;">ELIMINAR</button>`;
        popupContent += `<button onclick="abrirModalDesplazamiento('${id}', ${latlng.lat}, ${latlng.lng})" style="background:#3b82f6; color:white; border:none; padding:5px; cursor:pointer; margin-top:5px; width:100%; border-radius:3px;">🔄 DESPLAZAR</button>`;
    }
    
    marker.bindPopup(popupContent);
    marker.config = config;
    window.activeMarkers[id] = marker;
}

function abrirModalDesplazamiento(markerId, lat, lng) {
    pendingMoveMarkerId = markerId;
    document.getElementById('destino-coordenada').value = '';
    document.getElementById('desplazamiento-tiempo').value = 5;
    openModal('modal-desplazamiento');
}

function ejecutarDesplazamiento() {
    const destCoordStr = document.getElementById('destino-coordenada').value;
    const tiempoSeg = parseInt(document.getElementById('desplazamiento-tiempo').value) || 5;
    
    if (!destCoordStr.trim()) {
        showTacticalAlert("DESTINO REQUERIDO", "Ingrese las coordenadas de destino.", "⚠️", "#fbbf24");
        return;
    }
    
    const coords = parsearCoordenadas(destCoordStr);
    if (!coords) {
        showTacticalAlert("FORMATO INCORRECTO", "Use formato: latitud, longitud", "⚠️", "#fbbf24");
        return;
    }
    
    showTacticalAlert("VERIFICANDO DESTINO", "Validando jurisdicción del destino...", "🔍", "#38bdf8");
    
    obtenerPaisDesdeCoordenadas(coords.lat, coords.lng).then(pais => {
        if (pais === "Venezuela") {
            showTacticalConfirm(
                "CONFIRMAR DESPLAZAMIENTO",
                `¿Ejecutar movimiento del activo?\n\nDESTINO: ${coords.lat}, ${coords.lng}\nTIEMPO: ${tiempoSeg} segundos`,
                () => {
                    realizarDesplazamiento(pendingMoveMarkerId, coords.lat, coords.lng, tiempoSeg);
                    closeModals();
                },
                null,
                "🔄"
            );
        } else {
            const mensaje = pais 
                ? `🌍 Ubicación detectada: ${pais}\n\n⛔ OPERACIÓN CANCELADA: Solo se permiten operaciones dentro del territorio venezolano.`
                : `⛔ OPERACIÓN CANCELADA: No se pudo verificar la ubicación.`;
            showTacticalAlert("DESTINO NO AUTORIZADO", mensaje, "🚫", "#ef4444");
            addLog(`❌ DENEGADO: Intento de desplazamiento a [${coords.lat}, ${coords.lng}]`);
        }
    });
}

function realizarDesplazamiento(markerId, destLat, destLng, duracionSeg) {
    const marker = window.activeMarkers[markerId];
    if (!marker) {
        showTacticalAlert("ERROR", "No se encontró el marcador a desplazar.", "❌", "#ef4444");
        return;
    }
    
    const config = marker.config;
    const startLatLng = marker.getLatLng();
    const startTime = Date.now();
    const endTime = startTime + (duracionSeg * 1000);
    let lastUpdateTime = 0;
    
    function animateMove() {
        const now = Date.now();
        
        if (now >= endTime) {
            marker.setLatLng([destLat, destLng]);
            db.ref('mision_activa/puntos/' + markerId).update({
                lat: destLat,
                lng: destLng,
                isMoving: false
            }).then(() => {
                addLog(`DESPLAZAMIENTO: Activo movido a [${destLat}, ${destLng}]`);
                showTacticalAlert("DESPLAZAMIENTO COMPLETADO", "El activo ha llegado a su destino.", "✅", "#4ade80");
                
                const color = config.faction === 'ALIADO' ? '#4ade80' : '#ef4444';
                const cantidad = config.cantidad || 1;
                const displayCantidad = cantidad > 1 ? `x${cantidad}` : '';
                
                let newPopupContent = `
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; min-width: 180px;">
                <b style="color:${color}; font-size: 14px;">${config.asset.toUpperCase()} ${displayCantidad}</b><br>
                <hr style="margin: 5px 0; border: 0; border-top: 1px solid #334155;">
                <b>BANDO:</b> ${config.faction}<br>
                <b>COMPONENTE:</b> ${config.component}<br>
                <b>CANTIDAD:</b> ${cantidad} unidad(es)<br>
                <b>COORDENADAS:</b> ${destLat.toFixed(6)}, ${destLng.toFixed(6)}
                </div>
                `;
                
                if (userRole === "admin" && markerId) {
                    newPopupContent += `<button onclick="deleteMarker('${markerId}')" style="background:#ef4444; color:white; border:none; padding:5px; cursor:pointer; margin-top:8px; width:100%; border-radius:3px;">ELIMINAR</button>`;
                    newPopupContent += `<button onclick="abrirModalDesplazamiento('${markerId}', ${destLat}, ${destLng})" style="background:#3b82f6; color:white; border:none; padding:5px; cursor:pointer; margin-top:5px; width:100%; border-radius:3px;">🔄 DESPLAZAR</button>`;
                }
                
                marker.unbindPopup();
                marker.bindPopup(newPopupContent);
                marker.config = config;
            });
            return;
        }
        
        const progress = (now - startTime) / (duracionSeg * 1000);
        const currentLat = startLatLng.lat + (destLat - startLatLng.lat) * progress;
        const currentLng = startLatLng.lng + (destLng - startLatLng.lng) * progress;
        
        marker.setLatLng([currentLat, currentLng]);
        
        if (now - lastUpdateTime >= 200) {
            lastUpdateTime = now;
            db.ref('mision_activa/puntos/' + markerId).update({
                lat: currentLat,
                lng: currentLng,
                isMoving: true
            });
        }
        
        requestAnimationFrame(animateMove);
    }
    
    addLog(`DESPLAZAMIENTO: Iniciando movimiento hacia [${destLat}, ${destLng}] en ${duracionSeg} segundos`);
    animateMove();
}

function listenToCloud() {
    db.ref('mision_activa/puntos').off('child_added');
    db.ref('mision_activa/puntos').off('child_changed');
    db.ref('mision_activa/puntos').off('child_removed');
    
    db.ref('mision_activa/puntos').on('child_added', (snapshot) => {
        const val = snapshot.val();
        if (val && val.info && !window.activeMarkers[snapshot.key]) {
            createMarker({ lat: val.lat, lng: val.lng }, val.info, snapshot.key);
        }
    });
    
    db.ref('mision_activa/puntos').on('child_changed', (snapshot) => {
        const val = snapshot.val();
        const id = snapshot.key;
        
        if (val && val.info && window.activeMarkers[id]) {
            window.activeMarkers[id].setLatLng([val.lat, val.lng]);
            
            const color = val.info.faction === 'ALIADO' ? '#4ade80' : '#ef4444';
            const cantidad = val.info.cantidad || 1;
            const displayCantidad = cantidad > 1 ? `x${cantidad}` : '';
            
            const newPopupContent = `
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; min-width: 180px;">
            <b style="color:${color}; font-size: 14px;">${val.info.asset.toUpperCase()} ${displayCantidad}</b><br>
            <hr style="margin: 5px 0; border: 0; border-top: 1px solid #334155;">
            <b>BANDO:</b> ${val.info.faction}<br>
            <b>COMPONENTE:</b> ${val.info.component}<br>
            <b>CANTIDAD:</b> ${cantidad} unidad(es)<br>
            <b>COORDENADAS:</b> ${val.lat.toFixed(6)}, ${val.lng.toFixed(6)}
            </div>
            `;
            
            window.activeMarkers[id].unbindPopup();
            window.activeMarkers[id].bindPopup(newPopupContent);
            window.activeMarkers[id].config = val.info;
        }
    });
    
    db.ref('mision_activa/puntos').on('child_removed', (snapshot) => {
        const id = snapshot.key;
        if (window.activeMarkers[id]) {
            map.removeLayer(window.activeMarkers[id]);
            delete window.activeMarkers[id];
            addLog("SISTEMA: Activo removido del teatro de operaciones.");
        }
    });
}

function deleteMarker(id) {
    showTacticalConfirm("ELIMINAR ACTIVO", "¿Confirma la desincorporación y remoción de este activo del plano operacional?", () => {
        db.ref('mision_activa/puntos/' + id).remove();
    }, null, "💥");
}

function confirmarLimpiezaTotal() {
    showTacticalConfirm("PURGA TOTAL DEL MAPA", "¡ADVERTENCIA CRÍTICA! Se borrarán TODOS los marcadores y activos del mapa en tiempo real. Esta acción es irreversible.", () => {
        db.ref('mision_activa/puntos').set(null);
    }, null, "⚠️");
}

async function exportTacticalPDF() {
    addLog("SISTEMA: Generando captura táctica...");
    const mapElement = document.getElementById('map');
    setTimeout(async () => {
        try {
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(mapElement, { 
                    useCORS: true, 
                    allowTaint: true, 
                    backgroundColor: '#0a0c0f',
                    scale: 1.5
                });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('l', 'mm', 'a4');
                
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(14);
                pdf.setTextColor(251, 191, 36);
                pdf.text("SITAC VEN - REPORTE DE SITUACIÓN", 15, 15);
                
                pdf.setFontSize(9);
                pdf.setTextColor(148, 163, 184);
                const fecha = new Date();
                pdf.text(`Fecha: ${fecha.toLocaleDateString()} - Hora: ${fecha.toLocaleTimeString()}`, 15, 22);
                pdf.text(`Generado por: ${currentUserRank}`, 15, 29);
                
                pdf.addImage(imgData, 'PNG', 10, 35, 275, 150);
                
                pdf.setFontSize(8);
                pdf.setTextColor(100, 116, 139);
                pdf.text("SITAC VEN v1.0 - Sistema Táctico de Comando y Control", 15, 195);
                pdf.text("Documento clasificado - Uso militar exclusivo", 15, 200);
                
                pdf.save(`SITAC_REPORTE_${Date.now()}.pdf`);
                addLog("SISTEMA: PDF generado exitosamente.");
                showTacticalAlert("EXPORTACIÓN EXITOSA", "El reporte en PDF del teatro de operaciones ha sido compilado y descargado.", "📊", "#4ade80");
            }
        } catch (err) {
            addLog("ERROR: Fallo en la exportación.");
            showTacticalAlert("ERROR DE EXPORTACIÓN", "Fallo al procesar el canvas del mapa táctico.", "❌", "#ef4444");
        }
    }, 500);
}

function limpiarConsolaLocal() {
    const b = document.getElementById('console-body');
    if (b) {
        b.innerHTML = "";
        addLog("SISTEMA: Registro de operaciones purgado localmente.");
    }
}

function abrirBaseDatosPersonal() {
    escucharRegistroPersonal();
    const modalPersonal = document.getElementById('modal-db-personal');
    if (modalPersonal) {
        modalPersonal.style.display = "block";
        const wrapper = document.querySelector('.db-table-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
        addLog("SISTEMA: Terminal de Base de Datos (RTDB) enlazada.");
    } else {
        console.error("Error crítico: No se encontró el contenedor 'modal-db-personal' en la interfaz.");
    }
}

// ==========================================
// PANEL DE ESTADÍSTICAS
// ==========================================

function abrirPanelEstadisticas() {
    actualizarEstadisticas();
    openModal('modal-estadisticas');
}

function actualizarEstadisticas() {
    db.ref('mision_activa/puntos').once('value').then(snapshot => {
        const datos = snapshot.val() || {};
        
        let aliados = 0;
        let enemigos = 0;
        let totalActivos = 0;
        
        const componentes = {
            "Ejército Bolivariano": 0,
            "Armada Bolivariana": 0,
            "Aviación Militar Bolivariana": 0,
            "Guardia Nacional Bolivariana": 0,
            "Milicia Bolivariana": 0,
            "Hostil": 0
        };
        
        const unidades = {
            "Tropas": 0,
            "Tanques": 0,
            "Aviones": 0,
            "Barcos": 0,
            "Drones": 0,
            "Terrorista": 0,
            "Enfrentamiento": 0,
            "Unidad Médica": 0
        };
        
        let totalCantidad = 0;
        
        for (let key in datos) {
            const item = datos[key];
            if (item && item.info) {
                totalActivos++;
                const cantidad = item.info.cantidad || 1;
                totalCantidad += cantidad;
                
                if (item.info.faction === 'ALIADO') {
                    aliados++;
                    const comp = item.info.component;
                    if (componentes[comp] !== undefined) {
                        componentes[comp] += cantidad;
                    }
                } else {
                    enemigos++;
                    componentes["Hostil"] += cantidad;
                }
                
                const unidad = item.info.asset;
                if (unidades[unidad] !== undefined) {
                    unidades[unidad] += cantidad;
                }
            }
        }
        
        document.getElementById('total-aliados').innerText = aliados;
        document.getElementById('total-enemigos').innerText = enemigos;
        document.getElementById('total-activos').innerText = totalActivos;
        
        const statsComponentesDiv = document.getElementById('stats-componentes');
        statsComponentesDiv.innerHTML = '';
        const maxCompValue = Math.max(...Object.values(componentes), 1);
        
        for (let [comp, count] of Object.entries(componentes)) {
            if (count > 0 || comp === 'Hostil') {
                const percent = totalCantidad > 0 ? (count / totalCantidad * 100).toFixed(1) : '0';
                const barWidth = (count / maxCompValue * 100);
                statsComponentesDiv.innerHTML += `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 180px; font-size: 12px;">${comp}</div>
                        <div style="flex: 1; background: #0f172a; height: 20px; border-radius: 2px; overflow: hidden;">
                            <div style="width: ${barWidth}%; background: #fbbf24; height: 100%;"></div>
                        </div>
                        <div style="width: 80px; font-size: 12px; font-weight: bold;">${count} (${percent}%)</div>
                    </div>
                `;
            }
        }
        
        const statsUnidadesDiv = document.getElementById('stats-unidades');
        statsUnidadesDiv.innerHTML = '';
        const maxUnitValue = Math.max(...Object.values(unidades), 1);
        
        for (let [unidad, count] of Object.entries(unidades)) {
            if (count > 0) {
                const percent = totalCantidad > 0 ? (count / totalCantidad * 100).toFixed(1) : '0';
                const barWidth = (count / maxUnitValue * 100);
                let color = '#38bdf8';
                if (unidad === 'Tropas') color = '#4ade80';
                if (unidad === 'Tanques') color = '#f59e0b';
                if (unidad === 'Aviones') color = '#ef4444';
                if (unidad === 'Barcos') color = '#3b82f6';
                if (unidad === 'Terrorista') color = '#ef4444';
                if (unidad === 'Unidad Médica') color = '#ec4898';
                
                statsUnidadesDiv.innerHTML += `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 140px; font-size: 12px;">${unidad}</div>
                        <div style="flex: 1; background: #0f172a; height: 20px; border-radius: 2px; overflow: hidden;">
                            <div style="width: ${barWidth}%; background: ${color}; height: 100%;"></div>
                        </div>
                        <div style="width: 80px; font-size: 12px; font-weight: bold;">${count} (${percent}%)</div>
                    </div>
                `;
            }
        }
        
        const statsResumenDiv = document.getElementById('stats-resumen');
        statsResumenDiv.innerHTML = `
            <div>🔹 Total de activos desplegados: <strong style="color:#fbbf24">${totalActivos}</strong></div>
            <div>🔹 Cantidad total de unidades: <strong style="color:#fbbf24">${totalCantidad}</strong></div>
            <div>🔹 Relación Aliados/Enemigos: <strong style="color:#4ade80">${aliados}</strong> : <strong style="color:#ef4444">${enemigos}</strong></div>
            <div>🔹 Promedio de unidades por activo: <strong style="color:#38bdf8">${totalActivos > 0 ? (totalCantidad / totalActivos).toFixed(1) : '0'}</strong></div>
        `;
        
    }).catch(error => {
        console.error("Error al cargar estadísticas:", error);
        showTacticalAlert("ERROR", "No se pudieron cargar las estadísticas.", "❌", "#ef4444");
    });
}

function verificarSesionYcargar() {
    const rangoGuardado = sessionStorage.getItem('sitac_sesion_rango');
    const rolGuardado = sessionStorage.getItem('sitac_sesion_rol');
    
    console.log("🔍 Verificando sesión - Rol:", rolGuardado);
    
    if (rolGuardado === 'admin') {
        console.log("👑 Cargando como ADMINISTRADOR");
        iniciarApp(rangoGuardado, 'admin');
        return;
    }
    
    if (rolGuardado === 'usuario') {
        console.log("👤 Cargando como USUARIO");
        iniciarApp(rangoGuardado, 'usuario');
        return;
    }
    
    console.log("❌ Sin sesión - Mostrando landing");
    const landing = document.getElementById('landing-page');
    const navbar = document.getElementById('navbar');
    const appContainer = document.getElementById('app-container');
    
    if (landing) landing.style.display = "block";
    if (navbar) navbar.style.display = "flex";
    if (appContainer) appContainer.style.display = "none";
    
    sessionStorage.removeItem('sitac_sesion_rango');
    sessionStorage.removeItem('sitac_sesion_rol');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verificarSesionYcargar);
} else {
    verificarSesionYcargar();
}