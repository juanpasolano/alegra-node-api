# Alegra Node API

WARNING
⚠️ Está en super super early dev.

Un pequeño wrapper para el API de [Alegra](https://www.alegra.com) en node.
Incluye Types!

## Getting started

### Instalacion

```
npm install alegra-nope-api --save
```

or

```
yarn add alegra-nope-api
```


### Uso

```javascript
import Alegra from "alegra-node-api"

// Instanciamos el cliente con nuestras credenciales
const alegra = new Alegra("EMAIL", "PASSWORD");

// Y treadoms los recursos que queremos
const res = await alegra.items.get();

console.log(res) // los items

```
