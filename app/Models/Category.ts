import { DateTime } from 'luxon'
import { BaseModel, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import Store from './Store'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public imageUrl: string

  @column()
  public imageName: string

  @column()
  public iconUrl: string

  @column()
  public iconName: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeUpdate()
  public static async hashPassword(category: Category) {
    if (category.$dirty.name) {
      const stores = await Store.query().where(
        'category_id',
        '=',
        category.id,
      )

      stores.map(async (store) => {
        await Store.query()
          .where('id', store.id)
          .update({ category_name: category.$dirty.name })
      })
    }
  }
}
