import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Store from 'App/Models/Store'
import Event from 'App/Models/Event'
import Category from 'App/Models/Category'
import Banner from 'App/Models/Banner'

export default class HomeController {
    async index({ response }: HttpContextContract) {

        try {
            const banners = await Banner.all()
            const catogories = await Category.all()
            const events = await Event.query().limit(10)
            const storesData = await Store.query()
                .orderBy('id', 'desc')
                .limit(4)

            const stores = storesData.map(store => {
                const storeJSON = store.toJSON()
                return {
                ...storeJSON,
                images_url: JSON.parse(storeJSON.images_url),
                images_names:  JSON.parse(storeJSON.images_names),
                }
            })

            return response.send({
                banners,
                catogories,
                events,
                stores
            })
            
        } catch (error) {
            console.log(error)
            return response.status(404).send({ message: 'Erro ao buscar get home' })
        }
    }

}