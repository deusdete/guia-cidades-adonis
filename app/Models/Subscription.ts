import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public plan_id: number

  @column()
  public user_id: number

  @column()
  public active_stores: number

  @column()
  public active_events: number

  @column()
  public active_banner: number

  @column()
  public status: string

  @column.dateTime()
  public start_date: DateTime

  @column.dateTime()
  public end_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
