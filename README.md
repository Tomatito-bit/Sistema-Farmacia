# Sistema de Gestión de Farmacia

## Módulo: Login (Semana 1)

Este módulo permite la autenticación de usuarios mediante el ingreso de un nombre de usuario y una contraseña. Su objetivo es controlar el acceso al sistema y garantizar que únicamente usuarios autorizados puedan ingresar.

---

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- HTML, CSS y JavaScript

---

## Funcionalidad

- Ingreso de usuario y contraseña  
- Validación de credenciales en base de datos  
- Acceso al sistema si los datos son correctos  
- Mensaje de error si los datos son incorrectos  

---

## Base de datos

Se utiliza una base de datos PostgreSQL con una tabla llamada **usuarios**, la cual almacena la información necesaria para la autenticación.

Incluye una restricción que asegura que la contraseña tenga exactamente 8 dígitos numéricos.

---

## Estructura del proyecto
