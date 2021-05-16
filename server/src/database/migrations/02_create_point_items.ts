import {Knex} from 'knex';

exports.up = async function (knex: Knex) {
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();

        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    })
}
 
exports.down = async function (knex: Knex) {
    return knex.schema.dropTable('items');
}