import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import updadeFile from 'App/Utils/UpdateFile'

import Env from '@ioc:Adonis/Core/Env'

import path from 'path'

import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  keyFile: path.resolve(Env.get('GOOGLE_APPLICATION_CREDENTIALS'))
});

const bucket = storage.bucket('guia_cidades');

export default class EventsController {
  async index() {
    try {
      const events = await Event.all()

      return events

    } catch (error) {

    }
  }

  async store({ request, auth, response }: HttpContextContract) {

    const {
      name,
      description,
      website,
      latitude,
      longitude,
      telephone,
      status,
      date_begin,
      date_end,
    } = request.all()

    const imageFile = request.file('image')

    let imageInfo = {
      url: '',
      fileName: ''
    }

    try {


      const event = await Event.create({
        name,
        description,
        website,
        latitude,
        longitude,
        telephone,
        status,
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

  async show({request}: HttpContextContract){
    const event = await Event.findOrFail(request.param('id'))

    return event
  }

  public async update({ request }: HttpContextContract) {

    const event = await Event.findOrFail(request.param('id'))

    const {
      name,
      description,
      website,
      latitude,
      longitude,
      telephone,
      status,
      date_begin,
      date_end,
    } = request.all()

    event.name = name
    event.description = description
    event.website = website
    event.latitude = latitude
    event.longitude = longitude
    event.telephone = telephone
    event.status = status
    event.date_begin = date_begin
    event.date_end = date_end

    await event.save()

    return event
  }


  public async destroy({ request, response }: HttpContextContract) {

    const event = await Event.findOrFail(request.param('id'))

    try {
      await bucket.file(`events/${event.image_name}`).delete();
    } catch (error) {
      console.log('deleteFiles erro: ', error)
    }

    await event.delete()

    return response.send({ message: 'Evento apagado com sucesso' })
  }
}
