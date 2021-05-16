/*
 app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);
    const user = users[id];

    return response.json(user);
});

app.post('/users', (request, response) => {
    const data = request.body;

    const user = {
        name: data.name, 
        email: data.email
    }; 

    return response.json(user);
});
*/

// Rota: Endereço completo da requisição
// Recurso: Qual entidade estamos acessando do sistema

// GET:  BUSCAR UMA OU MAIS INFORMAÇÕES DO BACK-END
// POST: CRIAR NOVA INFORMAÇÃO NO BACK-END
// PUT: ATUALIZAR UMA INFORMAÇÃO EXISTENTE NO BACK-END
// DELETE: REMOVER UMA INFORMAÇÃO DO BACK-END

// POST http://localhost:3333/users = Criar um usuário
// GET http://localhost:3333/users = Listar usuários
// GET http://localhost:3333/users = Buscar dados do usuário com IDs

// Request Param: Parâmetros que vem na própria rota que identificam um recurso
// Query Param: Parâmetros que vem na prórpia rota geralmente opcionais para filtros, paginação
// Request Body: Parâmetros para criação/atualização de informações

import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..'  , 'uploads'))); 

app.listen(3333);