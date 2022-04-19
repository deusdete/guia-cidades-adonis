import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import updadeFile from 'App/Utils/UpdateFile'

import Env from '@ioc:Adonis/Core/Env'

import path from 'path'

import { Storage } from '@google-cloud/storage'
import Subscription from 'App/Models/Subscription'

const storage = new Storage({
  keyFile: path.resolve(Env.get('GOOGLE_APPLICATION_CREDENTIALS'))
});

const bucket = storage.bucket('guia_cidades');

export default class EventsController {

  async allList({ auth, response }: HttpContextContract){
   
    try {

      const user: any = auth?.user
      const eventsData = await Event.query().where('user_id', '=', user?.id)
      const eventsJSON = eventsData.map(event => {
        return {
          id: event.id,
          name: event.name
        }
      })
      return response.send(eventsJSON)
    } catch (error) {
      return response.status(404).send({messege: 'Erro ao buscar emrpesas'})
    }
  }

  async index({ request, auth, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const city_id = request.header('X-City-Id')
      const limit = 15

      let eventsData: any = []

      const query = Event.query()

      if(city_id){
        query.where('city_id', '=', city_id)
      }

      if(auth.isLoggedIn){
        const user: any = auth?.user
        if(user?.isAdmin){
          query.orderBy('id', 'desc')
         
        }else{
          query
          .where('user_id', '=', user?.id)
          .orderBy('id', 'desc')
        }
        
      }else{
        query
          .where('status', '=', 1)
          .orderBy('created_at', 'desc')
      }

      eventsData = await query.paginate(page, limit)
     

      const paginationJSON = eventsData.serialize({
        fields: ['id', 'name', 'description', 'address', 'date_begin', 'image_url', 'image_name', 'status']
      })

      
      const data = paginationJSON.data.map((item) => {
        return {
          ...item,
          type: 'event',
        }
      })

      return { meta: paginationJSON.meta, data }

    } catch (error) {
      console.log(error)
      return response.status(404).send({ message: 'Erro ao bostar por eventos' })
    }
  }

  async store({ bouncer, request, subscriptionId, auth, response }: HttpContextContract) {
    await bouncer
      .with('EventPolicy')
      .authorize('create')
    const {
      name,
      description,
      address,
      website,
      latitude,
      longitude,
      telephone,
      whatsapp_number,
      status,
      city, 
      city_id,
      uf,
      date_begin,
      date_end,
    } = request.all()

    const imageFile = request.file('image')

    let imageInfo = {
      url: '',
      fileName: ''
    }

    try {

      if(auth.user?.isAdmin !== 1){
        const userSubscription = await Subscription.findOrFail(subscriptionId)
        userSubscription.active_events = userSubscription.active_events + 1

        await userSubscription.save()
      } 
      
      const event = await Event.create({
        name,
        description,
        address,
        website,
        latitude,
        longitude,
        telephone,
        whatsapp_number,
        status,
        city, 
        city_id,
        uf,
        date_begin,
        date_end,
        user_id: auth.user?.id
      })

      if (imageFile) {
        imageInfo = await updadeFile({
          folder: 'events',
          subFolder: event.id,
          file: imageFile
        })

        event.image_url = imageInfo.url
        event.image_name = imageInfo.fileName

        await event.save()

      

      }

      return response.status(201).send({message: 'Evento criada com sucesso'})

    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }

  }

  async show({bouncer, request}: HttpContextContract){
    const event = await Event.findOrFail(request.param('id'))

    await bouncer
      .with('EventPolicy')
      .authorize('view', event)

    return event
  }

  public async update({ bouncer, request, response }: HttpContextContract) {

    const event = await Event.findOrFail(request.param('id'))

    await bouncer
      .with('EventPolicy')
      .authorize('update', event)

    const {
      name,
      description,
      address,
      website,
      latitude,
      longitude,
      telephone,
      whatsapp_number,
      status,
      city,
      city_id,
      uf,
      date_begin,
      date_end,
    } = request.all()

    const imageFile = request.file('image')

    let imageInfo = {
      url: '',
      fileName: ''
    }

    try {


      event.name = name,
      event.description = description
      event.address = address
      event.website = website
      event.latitude = latitude
      event.longitude = longitude
      event.telephone = telephone
      event.whatsapp_number = whatsapp_number
      event.status = status
      event.city = city 
      event.city = city_id 
      event.uf = uf
      event.date_begin = date_begin
      event.date_end = date_end


      if (imageFile) {
        imageInfo = await updadeFile({
          folder: 'events',
          subFolder: event.id,
          file: imageFile
        })

        event.image_url = imageInfo.url
        event.image_name = imageInfo.fileName

        
      }

      await event.save()

      return response.status(201).send({message: 'Evento atualizado com sucesso'})

    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }
  }


  public async destroy({bouncer, auth, request, subscriptionId, response }: HttpContextContract) {
    const id = request.param('id')
    const event = await Event.findOrFail(id)

    await bouncer
      .with('EventPolicy')
      .authorize('delete', event)

    try {

      
      await bucket.deleteFiles({
        prefix: `events/${id}/`,
      })
      
      await event.delete()

      if(auth.user?.isAdmin !== 1){
        const userSubscription = await Subscription.findOrFail(subscriptionId)
        userSubscription.active_events = userSubscription.active_events - 1

        await userSubscription.save()
      } 

      return response.send({ message: 'Evento apagado com sucesso' })

    } catch (error) {
      console.log('deleteFiles erro: ', error)
    }
  
  }

  public async deleteImages({ bouncer, request, response }: HttpContextContract) {
    const id = request.param('id')
    const { all, image_name } = request.all()
    const event = await Event.findOrFail(id)

    await bouncer
      .with('EventPolicy')
      .authorize('delete', event)

    console.log({ all, image_name })
    try {

      if (all) {
        await bucket.deleteFiles({
          prefix: `events/${id}/`,
        })

        event.image_name = ""
        event.image_url = ""

        await event.save()

        return response.send({ message: 'Images apagadas com sucesso' })
      } else {


        const file = bucket.file(`events/${id}/${image_name}`);
        await file.delete()

        event.image_name = ""
        event.image_url = ""

        await event.save()

        return response.send({ message: 'Image apagado com sucesso' })
      }


    } catch (error) {
      console.log('deleteImages erro: ', error)
      return response.status(404).send({ message: 'Falha ao apagado imagem index', image_name })
    }

  }
}
