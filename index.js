import express from 'express';
import { readFile, writeFile } from 'fs/promises';

import userRouter from './routes/usuario.routes.js';
import itemsRouter from './routes/productos.routes.js';
import saleRouter from './routes/ventas.routes.js';
import postRouter from './routes/post.routes.js'

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`);
});
// rutas de API
app.use('/user', userRouter);
app.use('/item', itemsRouter);
app.use('/sale', saleRouter);
app.use('/posts', postRouter);

/*PARA LEVANTAR NUESTRO FRONT-END */
app.use(express.static('./public'))


/*RUTAS DE END-POINT */
app.use('/user', userRouter)
app.use('/posts', postRouter)// para los post







