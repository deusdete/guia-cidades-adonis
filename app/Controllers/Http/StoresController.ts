import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Store from 'App/Models/Store'

import Drive from '@ioc:Adonis/Core/Drive'

import updadeFile from 'App/Utils/UpdateFile'
import Subscription from 'App/Models/Subscription'

export default class StoresController {
  async allList({ auth, response }: HttpContextContract) {
    try {
      const user: any = auth?.user
      const storesData = await Store.query().where('user_id', '=', user?.id)
      const storesJSON = storesData.map((store) => {
        return {
          id: store.id,
          name: store.name,
        }
      })
      return response.send(storesJSON)
    } catch (error) {
      return response.status(404).send({ messege: 'Erro ao buscar empresas' })
    }
  }

  async index({ request, auth, response }: HttpContextContract) {
    try {
      const { category_id } = request.qs()
      const page = request.input('page', 1)
      const city_id = request.header('X-City-Id')
      const limit = 10

      let storesData: any = []

      const query = Store.query()

      if (city_id) {
        query.where('city_id', '=', city_id)
      }

      if (category_id) {
        query.where('category_id', '=', parseInt(category_id))
      }

      if (auth.isLoggedIn) {
        const user: any = auth?.user
        if (user?.isAdmin) {
          query.orderBy('id', 'desc')
        } else {
          query.where('user_id', '=', user?.id).orderBy('id', 'desc')
        }
      } else {
        query.where('status', '=', 1).orderBy('created_at', 'desc')
      }

      storesData = await query.paginate(page, limit)

      const paginationJSON = storesData.serialize({
        fields: [
          'id',
          'name',
          'detail',
          'address',
          'images_url',
          'images_names',
          'category_name',
          'status',
         
        ],
      })

      const data = paginationJSON.data.map((item) => {
        return {
          ...item,
          type: 'store',
        }
      })
      return { meta: paginationJSON.meta, data }
    } catch (error) {
      console.log(error)
      return response.status(404).send({ message: 'Erro ao bostar por lojas' })
    }
  }

  async store({
    bouncer,
    request,
    subscriptionId,
    auth,
    response,
  }: HttpContextContract) {
    await bouncer.with('StorePolicy').authorize('create')

    const {
      name,
      detail,
      telephone,
      whatsapp_number,
      website,
      address,
      latitude,
      longitude,
      status,
      category_id,
      video_url,
      city,
      city_id,
      uf,
    } = request.all()
    const images = request.files('images')

    const userId: any = auth.user?.id

    const store = await Store.create({
      name,
      detail,
      telephone,
      whatsapp_number,
      website,
      address,
      latitude,
      longitude,
      status,
      category_id,
      video_url,
      city,
      city_id,
      uf,
      user_id: userId,
    })

    let imageUrls: string[] = []
    let imageNames: string[] = []

    try {
      for (let image of images) {
        const info = await updadeFile({
          folder: 'stores',
          subFolder: store.id,
          file: image,
        })

        console.log(info)

        imageUrls.push(info.url)
        imageNames.push(info.fileName)
      }

      store.images_url = JSON.stringify(imageUrls)
      store.images_names = JSON.stringify(imageNames)

      if (auth.user?.isAdmin !== 1) {
        const userSubscription = await Subscription.findOrFail(subscriptionId)
        userSubscription.active_stores = userSubscription.active_stores + 1

        await userSubscription.save()
      }

      await store.save()

      return response.status(201).send({ message: 'Loja criada com sucesso' })
    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }
  }

  async show({ bouncer, request }: HttpContextContract) {
    const storeData = await Store.findOrFail(request.param('id'))
    const storeJSON = storeData.toJSON()

    await bouncer.with('StorePolicy').authorize('view', storeData)

    return storeJSON
  }

  public async update({ bouncer, request, response }: HttpContextContract) {
    const store = await Store.findOrFail(request.param('id'))

    await bouncer.with('StorePolicy').authorize('update', store)

    const {
      name,
      detail,
      telephone,
      whatsapp_number,
      website,
      address,
      latitude,
      longitude,
      status,
      category_id,
      video_url,
      city,
      city_id,
      uf,
    } = request.all()
    const images = request.files('images')

    try {
      store.name = name
      store.detail = detail
      store.telephone = telephone
      store.whatsapp_number = whatsapp_number
      store.website = website
      store.address = address
      store.latitude = latitude
      store.longitude = longitude
      store.status = status
      store.category_id = category_id
      store.video_url = video_url
      store.city = city
      store.city_id = city_id
      store.uf = uf
      store.video_url = video_url

      const imagesUrlData = JSON.parse(store.images_url)
      const imagesNamesData = JSON.parse(store.images_names)

      if (images) {
        for (let image of images) {
          const info = await updadeFile({
            folder: 'stores',
            subFolder: store.id,
            file: image,
          })

          console.log(info)

          imagesUrlData.push(info.url)
          imagesNamesData.push(info.fileName)
        }
      }

      store.images_url = JSON.stringify(imagesUrlData)
      store.images_names = JSON.stringify(imagesNamesData)

      await store.save()

      return response.send({ message: 'Loja atualizada com suceso' })
    } catch (error) {
      console.log(error)
      return response.status(400).send({ message: 'Erro ao atualizar store' })
    }
  }

  public async destroy({
    bouncer,
    auth,
    request,
    subscriptionId,
    response,
  }: HttpContextContract) {
    const id = request.param('id')
    const store = await Store.findOrFail(id)

    await bouncer.with('StorePolicy').authorize('delete', store)

    try {
      // await bucket.deleteFiles({
      //   prefix: `stores/${id}/`,
      // })
      await Drive.delete(`stores/${id}/`)
      await store.delete()

      if (auth.user?.isAdmin !== 1) {
        const userSubscription = await Subscription.findOrFail(subscriptionId)
        userSubscription.active_stores = userSubscription.active_stores - 1

        await userSubscription.save()
      }

      return response.send({ message: 'Loja apagado com sucesso' })
    } catch (error) {
      console.log('deleteFiles erro: ', error)
      return response.status(404).send({ message: 'Erro ao apagado loja' })
    }
  }

  public async deleteImages({
    bouncer,
    request,
    response,
  }: HttpContextContract) {
    const id = request.param('id')
    const { all, index, image_name } = request.all()
    const store = await Store.findOrFail(id)

    await bouncer.with('StorePolicy').authorize('delete', store)

    console.log({ all, index, image_name })
    try {
      if (all) {
        // await bucket.deleteFiles({
        //   prefix: `stores/${id}/`,
        // })

        await Drive.delete(`stores/${id}/`)

        store.images_names = '[]'
        store.images_url = '[]'

        await store.save()

        return response.send({ message: 'Images apagadas com sucesso' })
      } else {
        const image_names = JSON.parse(store.images_names)

        // const file = bucket.file(`stores/${id}/${image_names[index]}`)
        // await file.delete()

        await Drive.delete(`stores/${id}/${image_names[index]}`)

        const images_names = JSON.parse(store.images_names)
        const images_url = JSON.parse(store.images_url)

        const newImagesName = images_names.filter(function (
          _value,
          indexElement,
        ) {
          return indexElement !== index
        })

        const newImagesUrl = images_url.filter(function (_value, indexElement) {
          return indexElement !== index
        })

        console.log({ newImagesName, newImagesUrl })

        store.images_names = JSON.stringify(newImagesName)
        store.images_url = JSON.stringify(newImagesUrl)

        await store.save()

        return response.send({ message: 'Image apagado com sucesso' })
      }
    } catch (error) {
      console.log('deleteImages erro: ', error)
      return response
        .status(404)
        .send({ message: 'Falha ao apagado imagem index', all, index })
    }
  }
}
