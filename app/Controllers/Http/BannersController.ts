import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Banner from 'App/Models/Banner'
import updadeFile from 'App/Utils/UpdateFile'

import Env from '@ioc:Adonis/Core/Env'

import path from 'path'

import { Storage } from '@google-cloud/storage'
import Subscription from 'App/Models/Subscription'

const storage = new Storage({
  keyFile: path.resolve(Env.get('GOOGLE_APPLICATION_CREDENTIALS'))
});

const bucket = storage.bucket('guia_cidades');

export default class BannersController {
  async index({request, auth, response}: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const limit = 15

      let bannersData: any = []

      console.log('auth.isLoggedIn',auth.isLoggedIn)

      if(auth.isLoggedIn){
        const user: any = auth?.user
        if(user?.isAdmin){
          bannersData = await Banner.query()
            .orderBy('id', 'desc')
            .paginate(page, limit)
         
        }else{
          bannersData = await Banner.query()
            .where('user_id', '=', user?.id)
            .orderBy('id', 'desc')
            .paginate(page, limit)

        }
      }else{
        bannersData = await Banner.query()
          .where('status', '=', 1)
          .orderBy('created_at', 'desc')
          .paginate(page, limit)
      }
     

      const paginationJSON = bannersData.serialize({
        fields: ['id', 'title', 'description', 'image_url', 'image_name', 'status']
      })

      return paginationJSON

    } catch (error) {
      console.log(error)
      return response.status(404).send({ message: 'Erro ao bostar por eventos' })
    }
  }

  async store({ bouncer, request, auth, subscriptionId, response }: HttpContextContract) {

    await bouncer
      .with('BannerPolicy')
      .authorize('create')

    const {
      title,
      description,
      type,
      link_id,
      status,
    } = request.all()
    const imageFile = request.file('image')

    let imageInfo = {
      url: '',
      fileName: ''
    }

    try {


      const banner = await Banner.create({
        title,
        description,
        type,
        link_id,
        status,
        user_id: auth.user?.id
      })

      if (imageFile) {
        imageInfo = await updadeFile({
          folder: 'banners',
          subFolder: banner.id,
          file: imageFile
        })

        banner.image_url = imageInfo.url
        banner.image_name = imageInfo.fileName

        await banner.save()
      }

      if(auth.user?.isAdmin !== 1){
        const userSubscription = await Subscription.findOrFail(subscriptionId)
        userSubscription.active_banner = userSubscription.active_banner + 1

        await userSubscription.save()
      }

      return response.status(201).send({message: 'Banner criada com sucesso'})

    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }

  }

  async show({bouncer, request}: HttpContextContract){
    
    const category = await Banner.findOrFail(request.param('id'))

    await bouncer
      .with('BannerPolicy')
      .authorize('view', category)

    return category
  }

  public async update({bouncer, request, response }: HttpContextContract) {

    const banner = await Banner.findOrFail(request.param('id'))

    await bouncer
      .with('BannerPolicy')
      .authorize('update', banner)

    const {
      title,
      description,
      type,
      link_id,
      status,
    } = request.all()

    const imageFile = request.file('image')

    let imageInfo = {
      url: '',
      fileName: ''
    }

    try {
      if (imageFile) {
        imageInfo = await updadeFile({
          folder: 'banners',
          subFolder: banner.id,
          file: imageFile
        })

        banner.image_url = imageInfo.url
        banner.image_name = imageInfo.fileName
      }

      banner.title = title
      banner.description = description
      banner.type = type
      banner.link_id = link_id
      banner.status = status

      await banner.save()

      return response.send({message: 'Evento atualizada com suceso'})
    } catch (error) {
      return response.status(404).send({message: 'Erro ao tentar atualziar evento'})
    }

    
  }


  public async destroy({ bouncer, auth, request, subscriptionId, response }: HttpContextContract) {

    const id = request.param('id')
    const banner = await Banner.findOrFail(id)

    await bouncer
      .with('BannerPolicy')
      .authorize('delete', banner)


    try {
      await bucket.deleteFiles({
        prefix: `banners/${id}/`,
      })

      await banner.delete()

      if(auth.user?.isAdmin !== 1){
        const userSubscription = await Subscription.findOrFail(subscriptionId)
        userSubscription.active_banner = userSubscription.active_banner - 1

        await userSubscription.save()
      }

      return response.send({ message: 'Banner apagado com sucesso' })

    } catch (error) {
      console.log('deleteFiles erro: ', error)
    }

  }

  public async deleteImages({ bouncer, request, response }: HttpContextContract) {
    const id = request.param('id')
    const banner = await Banner.findOrFail(id)

    await bouncer
      .with('BannerPolicy')
      .authorize('delete', banner)

    try {

      await bucket.deleteFiles({
        prefix: `banners/${id}/`,
      })

      banner.image_name = ""
      banner.image_url = ""

      await banner.save()

      return response.send({ message: 'Images apagadas com sucesso' })


    } catch (error) {
      console.log('deleteImages erro: ', error)
      return response.status(404).send({ message: 'Falha ao apagado imagem index'})
    }

  }
}
