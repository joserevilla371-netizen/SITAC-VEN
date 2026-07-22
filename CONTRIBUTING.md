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

   ## 📝 CONVENTIONAL COMMITS

Todos los commits deben seguir el estándar de **Conventional Commits** con referencia a tareas.

### Formato

<tipo>(<alcance>): <descripción breve> (Tarea #XX)


### Tipos de commits

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de error |
| `docs` | Documentación |
| `style` | Formato/estilo (no afecta lógica) |
| `refactor` | Refactorización |
| `test` | Pruebas |
| `chore` | Mantenimiento |
| `ci` | CI/CD |
| `deploy` | Despliegue |

### Ejemplos

```bash
# ✅ VÁLIDO
git commit -m "feat(auth): agregar registro de usuarios (Tarea #5)"
git commit -m "fix(map): corregir validación de coordenadas (Tarea #8)"
git commit -m "docs(readme): actualizar instrucciones de instalación (Tarea #15)"

# ❌ INVÁLIDO
git commit -m "cambios"
git commit -m "arregle cosas"
git commit -m "update"

