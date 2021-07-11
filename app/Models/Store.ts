import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public website: string

  @column()
  public address: string

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public category_id: number

  @column()
  public status: number

  @column()
  public detail: string

  @column({
    serialize: (value: string | null) => {
      return value ? JSON.parse(value) : value
    },
  })
  public images_url: string

  @column({
    serialize: (value: string | null) => {
      return value ? JSON.parse(value) : value
    },
  })
  public images_names: string

  @column()
  public video_url: string

  @column()
  public telephone: string

  @column()
  public city: string

  @column()
  public uf: string

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
