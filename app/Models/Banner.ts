import { DateTime } from "luxon";
import {
  afterDelete,
  afterSave,
  BaseModel,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import Redis from "@ioc:Adonis/Addons/Redis";

export default class Banner extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public type: string;

  @column()
  public link_id: string;

  @column()
  public image_url: string;

  @column()
  public image_name: string;

  @column()
  public status: number;

  @column()
  public user_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @afterSave()
  public static async updateRedisCategoriesAfterUpdate() {
    const banners = await Banner.query()
      .where("status", "=", 1)
      .orderBy("created_at", "desc");
    await Redis.set("categories", JSON.stringify(banners), "EX", 60);
  }

  @afterDelete()
  public static async updateRedisCategoriesAfterDelete() {
    const banners = await Banner.query()
      .where("status", "=", 1)
      .orderBy("created_at", "desc");
    await Redis.set("categories", JSON.stringify(banners), "EX", 60);
  }
}
