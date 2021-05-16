import {Knex} from 'knex';

exports.up = async function (knex: Knex) {
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    })
}
 
exports.down = async function (knex: Knex) {
    return knex.schema.dropTable('items');
}