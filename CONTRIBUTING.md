# 📋 GUÍA DE CONTRIBUCIÓN - SITAC VEN

## 🌿 ESTRUCTURA DE RAMAS (GIT FLOW)

| Rama | Propósito |
|------|-----------|
| `main` | Código en producción. **PROTEGIDA** - No se sube directamente |
| `develop` | Integración de nuevas funcionalidades |
| `feature/*` | Nuevas características (ej: `feature/login`, `feature/mapa`) |
| `hotfix/*` | Correcciones urgentes en producción |

## 📝 FORMATO DE NOMBRES DE RAMAS


feature/descripcion-breve
hotfix/descripcion-breve
bugfix/descripcion-breve


**Ejemplos:**
- `feature/autenticacion-usuarios`
- `hotfix/error-mapa`
- `bugfix/validacion-cedula`

## 📌 CONVENTIONAL COMMITS

Todos los commits deben seguir este formato:

<tipo>(<alcance>): <descripción breve>

[opcional: descripción detallada]


### Tipos permitidos:
| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de error |
| `docs` | Cambios en documentación |
| `style` | Cambios de formato (no afectan lógica) |
| `refactor` | Refactorización de código |
| `test` | Agregar o modificar pruebas |
| `chore` | Tareas de mantenimiento |

### Ejemplos:

feat(auth): agregar registro de usuarios
fix(map): corregir validación de coordenadas
docs(readme): actualizar instrucciones de instalación


## 🔒 PROTECCIÓN DE RAMA MAIN

- ❌ **No se permite** subir código directamente a `main`
- ✅ **Requisito obligatorio**: Pull Request (PR)
- 👥 **Revisión requerida**: Al menos 1 aprobación de compañero
- ✅ **Aprobación automática**: Todos los checks deben pasar

## 📋 PROCESO PARA CONTRIBUIR

1. Crear rama desde `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nueva-funcionalidad

   