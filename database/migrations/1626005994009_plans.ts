import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Plans extends BaseSchema {
  protected tableName = 'plans'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('description').defaultTo('')
      table.integer('frequency').notNullable()
      table.string('frequency_type').notNullable()
      table.decimal('value')
      table.integer('repetitions')
      table.json('free_trial').defaultTo('[]')
      table.integer('max_stores').notNullable()
      table.integer('max_events').notNullable()
      table.integer('max_banners').notNullable()
      table.boolean('allow_create_banner').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
