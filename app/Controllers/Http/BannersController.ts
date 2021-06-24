import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Banner from 'App/Models/Banner'
import updadeFile from 'App/Utils/UpdateFile'

import Env from '@ioc:Adonis/Core/Env'

import path from 'path'

import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  keyFile: path.resolve(Env.get('GOOGLE_APPLICATION_CREDENTIALS'))
});

const bucket = storage.bucket('guia_cidades');

export default class BannersController {
  async index() {
    try {
      const banners = await Banner.all()

      return banners

    } catch (error) {

    }
  }

  async store({ request, auth, response }: HttpContextContract) {

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

      return response.status(201).send({message: 'Banner criada com sucesso'})

    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }

  }

  async show({request}: HttpContextContract){
    const category = await Banner.findOrFail(request.param('id'))

    return category
  }

  public async update({ request }: HttpContextContract) {

    const banner = await Banner.findOrFail(request.param('id'))

    const {
      title,
      description,
      type,
      link_id,
      status,
    } = request.all()

    banner.title = title
    banner.description = description
    banner.type = type
    banner.link_id = link_id
    banner.status = status

    await banner.save()

    return banner
  }


  public async destroy({ request, response }: HttpContextContract) {

    const banner = await Banner.findOrFail(request.param('id'))

    try {
      await bucket.file(`banners/${banner.image_name}`).delete();
    } catch (error) {
      console.log('deleteFiles erro: ', error)
    }

    await banner.delete()

    return response.send({ message: 'Banner apagado com sucesso' })
  }
}
