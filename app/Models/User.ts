import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  beforeFetch,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import Subscription from './Subscription'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public isAdmin?: number

  @column()
  public isManager?: number

  @column()
  public isUser?: number


  @hasOne(() => Subscription,{
    foreignKey: 'user_id',
    serializeAs: 'userSubscription'
  })
  public subscription: HasOne<typeof Subscription>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeFetch()
  public static ignoreDeleted (query: ModelQueryBuilderContract<typeof User>) {
    query.where('isAdmin', '<>', 1)
  }
}
