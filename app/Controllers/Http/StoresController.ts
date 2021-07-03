import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Store from 'App/Models/Store'

import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

import { Storage } from '@google-cloud/storage'
import updadeFile from 'App/Utils/UpdateFile'

const storage = new Storage({
  keyFile: path.resolve(Env.get('GOOGLE_APPLICATION_CREDENTIALS'))
});

const bucket = storage.bucket('guia_cidades');

export default class StoresController {
  async index() {
    try {


      const stores = await Store.all()
      return stores

    } catch (error) {

    }
  }

  async store({ request, auth, response }: HttpContextContract) {

    const {
      name,
      detail,
      telephone,
      website,
      address,
      latitude,
      longitude,
      status,
      category_id,
      video_url,
      city,
      uf,
    } = request.all()
    const images = request.files('images')

    console.log(auth.user?.isAdmin)

    const store = await Store.create({
      name,
      detail,
      telephone,
      website,
      address,
      latitude,
      longitude,
      status,
      category_id,
      video_url,
      city,
      uf,
      user_id: auth.user?.id
    })

    let imageUrls: string[] = []
    let imageNames: string[] = []

    try {

      for (let image of images) {
        const info = await updadeFile({
          folder: 'stores',
          subFolder: store.id,
          file: image
        })

        imageUrls.push(info.url)
        imageNames.push(info.fileName)
      }

      store.images_url = JSON.stringify(imageUrls)
      store.images_names =  JSON.stringify(imageNames)

      await store.save()

      return response.status(201).send({ message: 'Loja criada com sucesso' })

    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }

  }

  async show({ request }: HttpContextContract) {
    const store = await Store.findOrFail(request.param('id'))

    return store
  }

  public async update({ request }: HttpContextContract) {

    const store = await Store.findOrFail(request.param('id'))

    const {
      name,
      detail,
      telephone,
      website,
      address,
      latitude,
      longitude,
      status,
      category_id,
      video_url,
      city,
      uf,
    } = request.all()

    store.name = name
    store.detail = detail
    store.telephone = telephone
    store.website = website
    store.address = address
    store.latitude = latitude
    store.longitude = longitude
    store.status = status
    store.category_id = category_id
    store.video_url = video_url
    store.city = city
    store.uf = uf
    store.video_url = video_url

    await store.save()

    return store
  }


  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const store = await Store.findOrFail(id)

    try {


      await bucket.deleteFiles({
        prefix: `stores/${id}/`,
      })

    } catch (error) {
      console.log('deleteFiles erro: ', error)
    }

    await store.delete()

    return response.send({ message: 'Loja apagado com sucesso' })
  }

}
