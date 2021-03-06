import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stores extends BaseSchema {
  protected tableName = 'stores'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('website').defaultTo("")
      table.string('address').defaultTo("")
      table.float('latitude', 14, 7)
      table.float('longitude', 14, 7)
      table.integer('category_id').notNullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.string('detail').defaultTo("")
      table.json('images_url').defaultTo("[]")
      table.json('images_names').defaultTo("[]")
      table.string('video_url').defaultTo("")
      table.string('telephone').defaultTo("")
      table.string('whatsapp_number').defaultTo("")
      table.string('city').defaultTo("")
      table.integer('city_id').notNullable()
      table.string('uf').defaultTo("")
      table.integer('user_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
