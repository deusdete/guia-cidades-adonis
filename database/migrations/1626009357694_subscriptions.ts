import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('plan_id').unsigned().references('id').inTable('plans').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('active_stores').notNullable().defaultTo(0)
      table.integer('active_events').notNullable().defaultTo(0)
      table.integer('active_banner').notNullable().defaultTo(0)
      table.string('status').notNullable().defaultTo('pending')
      table.timestamp('start_date')
      table.timestamp('end_date')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
