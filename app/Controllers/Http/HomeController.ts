import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Store from 'App/Models/Store'
import Event from 'App/Models/Event'
import Category from 'App/Models/Category'
import Banner from 'App/Models/Banner'

export default class HomeController {
    async index({ response }: HttpContextContract) {

        try {
            const banners = await Banner.all()
            const categories = await Category.all()
            const events = await Event.query().limit(10)
            const storesData = await Store.query()
                .orderBy('id', 'desc')
                .limit(4)

            const stores = storesData.map(store => store.toJSON())

            return response.send({
                banners,
                categories,
                events,
                stores
            })
            
        } catch (error) {
            console.log(error)
            return response.status(404).send({ message: 'Erro ao buscar get home' })
        }
    }

}
