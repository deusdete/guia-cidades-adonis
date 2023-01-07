import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Store from 'App/Models/Store'
import Event from 'App/Models/Event'
import Category from 'App/Models/Category'
import Banner from 'App/Models/Banner'
import User from 'App/Models/User'
import Plan from 'App/Models/Plan'
import { v4 as uuidv4 } from 'uuid'
import Application from '@ioc:Adonis/Core/Application'
import resizeImage from 'App/Utils/resizeImage'
import fs from 'fs'
import getMetadata from 'App/Utils/getMetadata'
import saveLocalFile from 'App/Utils/saveLocalFile'

export default class HomeController {
  async index({ auth, response }: HttpContextContract) {
    try {
      if (auth.isLoggedIn) {
        const user: any = auth.user
        console.log('user?.id', user?.id)

        if (user.isAdmin) {
          const banners = await Banner.all()
          const events = await Event.all()
          const users = await User.all()
          const plans = await Plan.all()
          const categories = await Category.all()
          const storesData = await Store.all()

          const stores = storesData.map((store) => store.toJSON())

          return response.send({
            banners,
            categories,
            events,
            stores,
            plans,
            users,
          })
        } else {
          const banners = await Banner.query().where('user_id', '=', user?.id)
          const events = await Event.query().where('user_id', '=', user?.id)
          const storesData = await Store.query().where('user_id', '=', user?.id)

          const stores = storesData.map((store) => store.toJSON())

          return response.send({
            banners,
            events,
            stores,
          })
        }
      } else {
        const banners = await Banner.all()
        const categories = await Category.all()
        const events = await Event.query().limit(10)
        const storesData = await Store.query().orderBy('id', 'desc').limit(4)

        const stores = storesData.map((store) => store.toJSON())

        return response.send({
          banners,
          categories,
          events,
          stores,
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(404).send({ message: 'Erro ao buscar get home' })
    }
  }

  async uploadImage({ request, response }: HttpContextContract) {
    const image = request.file('image')

    try {
      const { fileName, filePath } = await saveLocalFile({
        name: uuidv4(),
        file: image,
      })

      const fileNameResize: any = await resizeImage({
        name: `${uuidv4()}`,
        filePath,
        format: 'png',
        width: 64,
        height: 64
      })

      const imageOriginal = await getMetadata(fileNameResize)
      const imageResized = await getMetadata(fileName)

      fs.unlinkSync(filePath)

      return response.send({imageOriginal, imageResized})
    } catch (error) {
      console.log(`An error occurred during processing: ${error}`)
    }
  }
}
