import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stores extends BaseSchema {
  protected tableName = 'stores'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('website').nullable()
      table.string('address').nullable()
      table.decimal('latitude', 8, 7).nullable()
      table.decimal('longitude', 8, 7).nullable()
      table.integer('category_id').notNullable()
      table.integer('status').nullable()
      table.string('detail').nullable()
      table.json('images_url').nullable()
      table.json('images_names').nullable()
      table.string('video_url').nullable()
      table.string('telephone').nullable()
      table.string('city').nullable()
      table.string('uf').nullable()
      table.integer('user_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
