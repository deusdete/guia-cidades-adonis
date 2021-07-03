import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stores extends BaseSchema {
  protected tableName = 'stores'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('website').nullable().defaultTo("")
      table.string('address').nullable().defaultTo("")
      table.decimal('latitude', 8, 7).nullable()
      table.decimal('longitude', 8, 7).nullable()
      table.integer('category_id').notNullable()
      table.integer('status').notNullable().defaultTo(1)
      table.string('detail').nullable().defaultTo("")
      table.json('images_url').nullable().defaultTo("[]")
      table.json('images_names').nullable().defaultTo("[]")
      table.string('video_url').nullable().defaultTo("")
      table.string('telephone').nullable().defaultTo("")
      table.string('city').nullable().defaultTo("")
      table.string('uf').nullable().defaultTo("")
      table.integer('user_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
