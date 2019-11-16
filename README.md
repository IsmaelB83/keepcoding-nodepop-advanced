# Version 2.0 de nodepop adaptada para el módulo de backend avanzado

## CONTENTS
- [INTRODUCCIÓN](#INTRODUCCIÓN)
- [DEPENDENCIAS](#DEPENDENCIAS)
  - [Funcionalidad básica del servidor y API](#Funcionalidad-básica-del-servidor-y-API)
  - [Gestión de ficheros .env](#Gestión-de-ficheros-.env)
  - [Authenticación y gestión de sesiones](#Authenticación-y-gestión-de-sesiones)
  - [Tratamiento de imagenes](#Tratamiento-de-imagenes)
  - [Internacionalización](#Internacionalización)
  - [Microservicio de generación de thumbnails](#Microservicio-de-generación-de-thumbnails)
- [INSTALACIÓN Y EJECUCIÓN](#INSTALACIÓN-Y-EJECUCIÓN)
  - [Descarga](#Descarga)
  - [Instalación](#Inicialización-de-base-de-datos)
  - [Ejecución](#Ejecución)
- [REST API](#REST-API)
  - [Anuncios](#Anuncios)
  - [Anuncios Schema](#Anuncios-schema)
  - [Obtener todos los anuncios](#Obtener-todos-los-anuncios)
  - [Obtener un único anuncio](#Obtener-un-único-anuncio)
  - [Filtrado de anuncios](#Filtrado-de-anuncios)
  - [Listado de tags](#Listado-de-tags)
  - [Crear un anuncio](#Crear-un-anuncio)
  - [Actualizar un anuncio](#Actualizar-un-anuncio)
- [WEB](#web)


## INTRODUCCIÓN

Este repositorio proporciona una versión avanzada del proyecto nodepop desarrollado en el módulo de backend del bootcamp de Keepcoding.
Para mantener el repositorio original intacto, he creado este nuevo repositorio. El repo original lo podeis encontrar aquí: https://github.com/IsmaelB83/keepcoding-nodepop-api

Las mejoras introducidas en esta versión son:
- Creación del modelo de usuario y persistencia en mongodb.
- Securización de la API mediante Json Web Token.
- Securización del frontal web mediante express-session y connect-mongo
- Carga de imagenes de los anuncios desde el API
- Implementación de un microservicio sobre rabbitMQ para generar los thumbnails de la imagen anterior 
- Internacionalización del frontal web mediante i18n.
- Gestión de parámetros de la aplicación mediante ficheros .env

## DEPENDENCIAS

Esta aplicación hace uso de los siguientes módulos de npm:

### Funcionalidad básica del servidor y API
- "express": "^4.17.1"
- "express-validator": "^6.1.1"
- "body-parser": "^1.19.0"
- "cookie-parser": "^1.4.4"
- "cors": "^2.8.5"
- "ejs": "^2.6.2"
- "moment": "^2.24.0"
- "mongoose": "^5.7.5"
- "morgan": "^1.9.1"

### Gestión de ficheros .env
- "dotenv": "^8.2.0"

### Authenticación y gestión de sesiones
- "jsonwebtoken": "^8.5.1"
- "express-session": "^1.17.0"
- "connect-mongo": "^3.1.2"
- "bcrypt-nodejs": "0.0.3"

### Tratamiento de imagenes
- "multer": "^1.4.2"
- "jimp": "^0.8.5"

### Internacionalización
- "i18n": "^0.8.4"

### Microservicio de generación de thumbnails
- "amqplib": "^0.5.5"


## INSTALACIÓN Y EJECUCIÓN

### Descarga

Para descargar este repositorio:
```
\downloads\git clone https://github.com/IsmaelB83/keepcoding-nodepop-advanced.git
```

### Instalación de modulos

Utiliza npm install para instalar todas las dependencias de la aplicación
```
\downloads\keepcoding-nodepop-advanced\npm install
```

### Inicialización de base de datos

Inicializa la base de datos mongo. Esto borrará la colección "advert" de la base de datos mongo (nodepop), y creará los anuncios contenidos en
\downloads\keepcoding-nodepop-advanced\src\database\data.json
```
\downloads\keepcoding-nodepop-advanced\npm run init
```

### Ejecución

Antes de arrancar debes generar un fichero .env, con la misma estructura que el .env.example que se adjunta a modo de ejemplo en el repositorio. En este fichero se deben indicar los siguientes parámetros mínimos:

Cadena de conexión a la base de datos mongodb:
- MONGODB_URL=mongodb://url:port/database

Cadena de conexión a la cola rabbitmq, haciendo uso del protocolo amqp:
- RABBITMQ_URL=amqp://user:pass@hostname/instance

Secret utilizado para generación del JWT y la configuración de sessión del frontal web:
- SECRET=aquivaelsecretcompleto

Rutas a los ficheros key y cert para poder arrancar el modo https:
- HTTPS_KEY=./certs/example.com+5-key.pem
- HTTPS_CERT=./certs/example.com+5.pem

Puerto en el que arrancar el servidor. Por defecto será el HTTPS.
- PORT=8443

Una vez configurado el fichero .env, arrancaremos la aplicación mediante:
```
\downloads\keepcoding-nodepop-advanced\npm start
```

Al mismo tiempo es necesario que arranquemos el microservicio encargado de generar los thumbnails. Para ello en una terminal adicional arrancaremos un worker de la siguiente forma:
```
\downloads\keepcoding-nodepop-advanced\npm run worker
```

## REST API

### Authenticacion
...

### Anuncios
Hay un total de 20 anuncios en el script de carga proporcionado.

### Anuncios-schema
|Key|Type|Description|
|---|---|---|
|_id|string|Id del anuncio
|name|string|Nombre del anuncio (30char)
|description|string|Descripción larga del anuncio (100char)
|price|number|Precio de compra/venta
|type|string|Tipo del anuncio. Puede ser 'buy' o 'sell'
|photo|string|Url a la imagen principal del anuncio
|thumbnail|string|Url a la imagen tipo thumbnail del anuncio
|tags|array|Array de tags asociados al anuncio


### Obtener todos los anuncios
Pueds obtener todos los anuncios de la base de datos mediante el endpoint `/anuncios`.
```
http://localhost:3001/apiv1/anuncios
```
```js
{
  "success": true,
  "results": [
    {
      "tags": [
        "lifestyle"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463ab4",
      "name": "PS4Pro",
      "description": "Compro PS4 Pro con menos de 1 año de uso",
      "price": 200.99,
      "type": "buy",
      "photo": "/images/adverts/original/ps4pro.jpg",
      "thumbnail": "/images/adverts/thumbnail/ps4pro.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.944Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    },
    // ...
  ]
}
```
### Obtener un único anuncio
Puede obtener un único anuncio añadiendo el `id` a continuación del endpoint: `/anuncios/5d3a0a5f9bd7ed2ece463ab4`
```
http://localhost:3001/apiv1/anuncios/5d3a0a5f9bd7ed2ece463ab4
```
```js
{
  "success": false,
  "result": {
    "tags": [
      "lifestyle"
    ],
    "_id": "5d3a0a5f9bd7ed2ece463ab4",
    "name": "PS4Pro",
    "description": "Compro PS4 Pro con menos de 1 año de uso",
    "price": 200.99,
    "type": "buy",
    "photo": "/images/adverts/original/ps4pro.jpg",
    "thumbnail": "/images/adverts/thumbnail/ps4pro.jpg",
    "__v": 0,
    "createdAt": "2019-07-25T20:00:31.944Z",
    "updatedAt": "2019-07-25T20:00:31.945Z"
  }
}
```

### Filtrado de anuncios
Puedes incluir filtros en la URL añadiendo parametros especiales a la consulta. Para comenzar con el filtrado incorpora el carácter `?` seguido de las queries a incorporar
en el siguiente formato `<query>=<value>`. Si necesitas encadenar varias consultas puedes utilizar el carácter `&`.

Ejemplos de consultas:
- Todos los anuncios que contienen el `tag` lifestyle: http://localhost:3001/apiv1/anuncios?tag=lifestyle: 
- Todos los anuncios con `price` entre 1 y 100: http://localhost:3001/apiv1/anuncios?price=1-100
- Las dos consultas anteriores combinadas: http://localhost:3001/apiv1/anuncios?tag=lifestyle&price=1-100
- Precio entre 1 y 100 de anuncios que empiecen por 'Com': http://localhost:3001/apiv1/anuncios?price=1-100&name=Com
- Sólo los anuncios de venta: http://localhost:3001/apiv1/anuncios?venta=true
- Sólo los anuncios de compra: http://localhost:3001/apiv1/anuncios?venta=false


Los parámetros disponibles para filtrado son:
- `name`: filtrado por los que empiecen con el string indicado (la API NO es case sensitive).
- `price`: filtrar por precio. Entre un rango x-y, menores a un precio x-, o mayores a un precio -y.
- `tag`: permite filtrar los anuncios que tengan el tag indicado. Dentro de los posibles (`work`, `lifestyle`, `motor`, `mobile`).
- `venta`: permite filtrar por anuncios de venta (=true), o anuncios de compra (=false)
- `skip`: permite saltar resultados (utilizado para paginar junto con limit)
- `limit`: permite limitar el número de resultados devueltos
- `fields`: campos a mostrar del anuncio

*Ejemplo de consulta*
```
http://localhost:3001/apiv1/anuncios?price=1-100&venta=false
```
```js
{
  "success": true,
  "results": [
    {
      "tags": [
        "lifestyle"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463abc",
      "name": "Comba de Crossfit",
      "price": 8,
      "description": "Soy el de las calleras.",
      "type": "buy",
      "photo": "/images/anuncios/comba.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.945Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    },
    {
      "tags": [
        "lifestyle",
        "work",
        "mobile"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463ab7",
      "name": "Teclado Gaming Razer Chroma",
      "price": 70,
      "description": "Busco teclado razer en buen estado.",
      "type": "buy",
      "photo": "/images/anuncios/tecladorazer.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.945Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    },
    {
      "tags": [
        "lifestyle"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463abb",
      "name": "Calleras Crossfit",
      "price": 15,
      "description": "Dejate de romperte las manos en los WODs",
      "type": "buy",
      "photo": "/images/anuncios/calleras.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.945Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    }
  ]
}
```

### Listado de tags
Puedes obtener un listado de los tags existentes en la base de datos mediante el recurso /tag de la API: http://127.0.0.1:3001/apiv1/tags

*Ejemplo de consulta*
```
http://127.0.0.1:3001/apiv1/tags
```
```js
{
  "success": true,
  "count": 4,
  "results": [
    "lifestyle",
    "mobile",
    "motor",
    "work"
  ]
}
```

### Crear un anuncio
Para crear un anuncio debes llamar a la url base de anuncios con el metodo POST. Pasando en el body del request todos los parametros para definir el nuevo anuncio
```
http://localhost:3001/apiv1/anuncios  (POST)
```

En un primer momento tanto "photo" como "thumbnail apuntarán a la misma url con la imagen generada. Esta url será la ubicada en la ruta /public/images/adverts/original. Adicionalmente, el controlador de la API generará un mensaje contra la cola rabbitmq, para que un worker se encargue de generar el resize de la imagen (el thumbnail), y adicionalmente actualizar el modelo (advert), apuntando el campo "thumbnail" a la nueva imagen generada. Que en este caso estará en la ruta /public/images/adverts/thumbnail.

De esta forma, mediante el uso de rabbitmq y un microservicio para la gestión de la generación del thumbnail, conseguimos desacoplar totalmente la generación de los thumbnails de la propia funcionalidad de la API.

### Actualizar un anuncio
Para actualizar un anuncio se debe llamar a la URL base de un anuncio único `anuncio/id` utilizando el metodo PUT. Además en el body del request se indicarán los nuevos valores
de los parametros que se deseen modificar.
```
http://localhost:3001/apiv1/anuncios/5d3a0a5f9bd7ed2ece463abb  (PUT)
```

## WEB

Adicionalmente a la API se proporciona una web con dos vistas, para poder visualizar el contenido de anuncios de la base de datos. Estas dos vistas son el propio `index`, y la vista de `detail`, 
a la que se navega desde la vista de index cuando se hace click en el detalle de un anuncio cualquiera:

```
http://localhost:3001/                          (index)
http://localhost:3001/5d3a0a5f9bd7ed2ece463abc  (detail del anuncio indicado)
```

Adicionalmente se proporciona una vista de login, sobre la que es imprescindible identificarse para navegar a la sección privada de la web. El login por defecto (incluido en el script de inicialización), es usuario **user@example.es** y password **1234**.
