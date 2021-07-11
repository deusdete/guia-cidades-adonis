import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Subscription from './Subscription'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasMany(() => Subscription, {
    foreignKey: 'plan_id',
    serializeAs: 'subscriptionPlan'
  })
  public subscription: HasMany<typeof Subscription>

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public frequency: number

  @column()
  public frequency_type: string

  @column()
  public value: number

  @column()
  public repetitions: number

  @column({
    serialize: (value: string | null) => {
      return value ? JSON.parse(value) : value
    },
  })
  public free_trial: string

  @column()
  public max_stores: number

  @column()
  public max_events: number

  @column()
  public max_banners: number

  @column()
  public allow_create_banner: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
