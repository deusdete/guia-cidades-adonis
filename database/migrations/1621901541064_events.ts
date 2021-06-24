import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Events extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('description').nullable()
      table.string('store_id').nullable()
      table.string('website').nullable()
      table.string('address').nullable()
      table.decimal('latitude', 8, 7).nullable()
      table.decimal('longitude', 8, 7).nullable()
      table.string('telephone').nullable()
      table.integer('status').nullable()
      table.string('image_url').nullable()
      table.string('image_name').nullable()
      table.integer('user_id').notNullable()
      table.string('city').notNullable()
      table.string('uf').notNullable()
      table.string('date_begin').nullable()
      table.string('date_end').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
