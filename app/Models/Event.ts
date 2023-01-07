import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public store_id: number;

  @column()
  public website: string;

  @column()
  public address: string;

  @column()
  public latitude: number;

  @column()
  public longitude: number;

  @column()
  public telephone: string;

  @column()
  public whatsapp_number: string;

  @column()
  public status: number;

  @column()
  public image_url: string;

  @column()
  public image_name: string;

  @column()
  public user_id: number;

  @column()
  public city: string;

  @column()
  public city_id: number;

  @column()
  public uf: string;

  @column()
  public date_begin: string;

  @column()
  public date_end: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
