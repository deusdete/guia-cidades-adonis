import Redis from '@ioc:Adonis/Addons/Redis'

 class RedisDB {
  async get(key: string) {
    try {
      const data = await Redis.get(key)

      if (data) {
        return JSON.parse(data)
      }

      return null
    } catch (error) {
      console.log('error get redis', error)
    }
  }

  async set(key: string, value: object) {
    try {
      await Redis.set(key, JSON.stringify(value))
    } catch (error) {
      console.log('error set redis', error)
    }
  }
}

export default new RedisDB()
