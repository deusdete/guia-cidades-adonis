import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Banners extends BaseSchema {
  protected tableName = 'banners'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('description').defaultTo('')
      table.string('type').notNullable()
      table.string('link_id').notNullable()
      table.float('latitude', 14, 10)
      table.float('longitude', 14, 10)
      table.string('image_url').defaultTo('')
      table.string('image_name').defaultTo('')
      table.boolean('status').notNullable().defaultTo(true)
      table.integer('user_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
