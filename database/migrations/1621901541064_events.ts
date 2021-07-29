import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Events extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('description').defaultTo('')
      table.integer('store_id').nullable()
      table.string('website').defaultTo('')
      table.string('address').defaultTo('')
      table.float('latitude', 14, 7)
      table.float('longitude', 14, 7)
      table.string('telephone').defaultTo('')
      table.string('whatsapp_number').defaultTo("")
      table.boolean('status').notNullable().defaultTo(true)
      table.string('image_url').defaultTo('')
      table.string('image_name').defaultTo('')
      table.integer('user_id').notNullable()
      table.string('city').notNullable()
      table.integer('city_id').notNullable()
      table.string('uf').notNullable()
      table.string('date_begin').defaultTo('')
      table.string('date_end').defaultTo('')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
