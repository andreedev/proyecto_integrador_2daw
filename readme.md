# Proyecto Integrador 2 DAW

Este proyecto es una aplicación web desarrollada como proyecto integrador del 2do año del Grado Superior de Desarrollo de Aplicaciones Web (DAW) en la Universidad Europea de Madrid.

El objetivo del proyecto es crear una plataforma para la gestión de un festival de cortometrajes, donde los usuarios pueden registrarse, iniciar sesión, subir sus cortometrajes, y los administradores pueden gestionar las inscripciones y el contenido del festival. 

El proyecto incluye funcionalidades de autenticación, gestión de datos, y una interfaz de usuario responsiva y accesible. Además, se han implementado pruebas unitarias para asegurar la calidad del código.

## Características principales
- Autenticación de usuarios (registro, inicio de sesión, recuperación de contraseña)
- Gestión de datos (CRUD para diferentes entidades)
- Interfaz de usuario responsiva y accesible
- Integración con bases de datos para almacenamiento de información
- Implementación de pruebas unitarias para asegurar la calidad del código
- Carpeta uploads para almacenar archivos subidos por los usuarios

## Tecnologías utilizadas
- PHP para el desarrollo del backend
- MySQL para la gestión de bases de datos
- HTML, CSS y JavaScript para el frontend
- PHPUnit para pruebas unitarias

## Librerías y herramientas
- Composer para la gestión de dependencias
- Airdatepicker para la selección de fechas en el frontend

### URL del proyecto en local (XAMPP)
http://localhost/DWES/proyecto_integrador_2daw/

## Instrucciones para ejecutar el proyecto
- Clonar el repositorio en tu máquina local
- Configurar la base de datos y actualizar las credenciales en el archivo de configuración
- Instalar las dependencias utilizando Composer
- Ejecutar el servidor local para acceder a la aplicación
- Si se quiere probarlo localmente, el campo "baseUrl" de la tabla configuracion debe ser ``http://localhost/DWES/proyecto_integrador_2daw/``
- Si se quiere probarlo en un servidor, el campo "baseUrl" de la tabla configuracion cambiaria ``https://dominio.com/``

## Como ejecutar las pruebas unitarias

### instalar PHPUnit si no está instalado
```
composer require --dev phpunit/phpunit
```

### Ejecutar pruebas
```
./vendor/bin/phpunit tests
```