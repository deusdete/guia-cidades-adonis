import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Store from 'App/Models/Store'

import Env from '@ioc:Adonis/Core/Env'

import path from 'path'

import { Storage } from '@google-cloud/storage'
import updadeFile from 'App/Utils/UpdateFile'

const storage = new Storage({
  keyFile: path.resolve(Env.get('GOOGLE_APPLICATION_CREDENTIALS'))
});

const bucket = storage.bucket('guia_cidades');

export default class StoresController {
  async index({ request, auth, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const limit = 15

      let storesData: any = []

      console.log('auth.isLoggedIn',auth.isLoggedIn)

      if(auth.isLoggedIn){
        storesData = await Store.query()
          .orderBy('created_at', 'desc')
          .paginate(page, limit)
      }else{
        storesData = await Store.query()
          .where('status', '=', 1)
          .orderBy('created_at', 'desc')
          .paginate(page, limit)
      }
     

      const paginationJSON = storesData.serialize({
        fields: ['id', 'name', 'address', 'images_url', 'status']
      })

      const data = paginationJSON.data.map(store => {
        return {
          ...store,
          images_url: JSON.parse(store.images_url)
        }
      })

      return { meta: paginationJSON.meta, data }

    } catch (error) {
      console.log(error)
      return response.status(404).send({ message: 'Erro ao bostar por lojas' })
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

    console.log({
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
    })

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

        console.log(info)

        imageUrls.push(info.url)
        imageNames.push(info.fileName)
      }

      store.images_url = JSON.stringify(imageUrls)
      store.images_names = JSON.stringify(imageNames)

      await store.save()

      return response.status(201).send({ message: 'Loja criada com sucesso' })

    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }

  }

  async show({ request }: HttpContextContract) {
    const storeData = await Store.findOrFail(request.param('id'))
    const storeJSON = storeData.toJSON()

    const store = {
      ...storeJSON,
      images_url: JSON.parse(storeJSON.images_url),
      images_names: JSON.parse(storeJSON.images_names)
    }

    return store
  }

  public async update({ request, response }: HttpContextContract) {

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
    const images = request.files('images')

    try {
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

    const imagesUrlData = JSON.parse(store.images_url)
    const imagesNamesData = JSON.parse(store.images_names)

    if(images){
      for (let image of images) {
        const info = await updadeFile({
          folder: 'stores',
          subFolder: store.id,
          file: image
        })

        console.log(info)

        imagesUrlData.push(info.url)
        imagesNamesData.push(info.fileName)
      }
    }

    store.images_url = JSON.stringify(imagesUrlData)
    store.images_names = JSON.stringify(imagesNamesData)

    await store.save()

    return response.send({message: 'Loja atualizada com suceso'})
    } catch (error) {
      console.log(error)
      return response.status(400).send({message: 'Erro ao atualizar store'})
    }
  }


  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const store = await Store.findOrFail(id)

    try {


      await bucket.deleteFiles({
        prefix: `stores/${id}/`,
      })
      await store.delete()

      return response.send({ message: 'Loja apagado com sucesso' })

    } catch (error) {
      console.log('deleteFiles erro: ', error)
      return response.status(404).send({ message: 'Erro ao apagado loja' })
    }


  }

  public async deleteImages({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const { all, index } = request.all()
    const store = await Store.findOrFail(id)
    console.log({ all, index, store })
    try {

      if (all) {
        await bucket.deleteFiles({
          prefix: `stores/${id}/`,
        })

        store.images_names = "[]"
        store.images_url = "[]"

        await store.save()

        return response.send({ message: 'Images apagadas com sucesso' })
      } else {

        const image_names = JSON.parse(store.images_names)

        const file = bucket.file(`stores/${id}/${image_names[index]}`);
        await file.delete()

        let newImagesName = JSON.parse(store.images_names)
        let newImagesUrl = JSON.parse(store.images_url)

        newImagesName.slice(index, 1)
        newImagesUrl.slice(index, 1)

        store.images_names = JSON.stringify(newImagesName)
        store.images_url = JSON.stringify(newImagesUrl)

        await store.save()

        return response.send({ message: 'Image apagado com sucesso' })
      }


    } catch (error) {
      console.log('deleteImages erro: ', error)
      return response.status(404).send({ message: 'Falha ao apagado imagem index', all, index })
    }

  }

}
