import {Knex} from 'knex';

exports.seed = async function (knex: Knex) {
    return await knex('items').insert([
        {id : 1, title: 'Lâmpadas', image: 'lampadas.svg' },
        {id : 2, title: 'Pilhas e baterias', image: 'baterias.svg' },
        {id : 3, title: 'Papéis e papelão', image: 'papeis-papelao.svg' },
        {id : 4, title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
        {id : 5, title: 'Resíduos Orgânicos', image: 'organicos.svg' },
        {id : 6, title: 'Óleo de Cozinha', image: 'oleo.svg' },
    ]);
}