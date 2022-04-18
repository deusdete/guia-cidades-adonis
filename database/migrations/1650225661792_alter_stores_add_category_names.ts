import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterStoresAddCategoryNames extends BaseSchema {

  public async up () {
    this.schema.alterTable('stores', (table) => {
      table.string('category_name').defaultTo("")
    })
  }
}
