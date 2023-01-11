import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Redis from '@ioc:Adonis/Addons/Redis'
import Category from 'App/Models/Category'

import Drive from '@ioc:Adonis/Core/Drive'

import updadeFile from 'App/Utils/UpdateFile'
export default class CategoriesController {
  async index({ request, response }: HttpContextContract) {
    const { search } = request.qs()
    try {
      let categories: Category[] = []
      let redis_cache = false
      const query = Category.query()
      if (search) {
        query.where('name', 'LIKE', '%' + search + '%')
        categories = await query.orderBy('name', 'desc')
      } else {
        
        const categoriesCache = await Redis.get('categories')

        if (!categoriesCache) {
          categories = await query.orderBy('name', 'desc')
          await Redis.set('categories', JSON.stringify(categories), "EX", 60)
        } else {
          categories = JSON.parse(categoriesCache)
          redis_cache = true
        }
      }

      return response.send({ categories, redis_cache })
    } catch (error) {
      console.log('err', error)
      return response.status(400).send(error)
    }
  }

  async store({ bouncer, request, response }: HttpContextContract) {
    const { name } = request.all()
    const imageFile = request.file('image')
    const iconFile = request.file('icon')

    await bouncer.with('CategoryPolicy').authorize('create')

    let imageInfo = {
      url: '',
      fileName: '',
    }
    let iconInfo = {
      url: '',
      fileName: '',
    }

    try {
      if (imageFile) {
        imageInfo = await updadeFile({
          folder: 'categories',
          subFolder: null,
          file: imageFile,
        })
      }

      if (iconFile) {
        iconInfo = await updadeFile({
          folder: 'categories',
          subFolder: null,
          file: iconFile,
        })
      }

      const category = {
        name,
        image_url: imageInfo.url,
        image_name: imageInfo.fileName,
        icon_url: iconInfo.url,
        icon_name: iconInfo.fileName,
      }

      console.log(category)

      await Category.create(category)

      return response
        .status(201)
        .send({ message: 'Categoria criada com sucesso' })
    } catch (err) {
      console.log('err', err)
      return response.status(400).send(err)
    }
  }

  async show({ request }: HttpContextContract) {
    const category = await Category.findOrFail(request.param('id'))

    return category
  }

  public async update({ bouncer, request, response }: HttpContextContract) {
    const category = await Category.findOrFail(request.param('id'))

    await bouncer.with('CategoryPolicy').authorize('update')

    const { name } = request.body()

    const imageFile = request.file('image')
    const iconFile = request.file('icon')

    let imageInfo = {
      url: '',
      fileName: '',
    }
    let iconInfo = {
      url: '',
      fileName: '',
    }

    try {
      if (imageFile) {
        imageInfo = await updadeFile({
          folder: 'caregorias',
          subFolder: null,
          file: imageFile,
        })

        category.imageName = imageInfo.url
        category.imageName = imageInfo.fileName
      }

      if (iconFile) {
        iconInfo = await updadeFile({
          folder: 'categories',
          subFolder: null,
          file: iconFile,
        })

        category.iconUrl = iconInfo.url
        category.iconName = iconInfo.fileName
      }

      category.name = name

      await category.save()

      return response.send({ message: 'Categorias atualizada com suceso' })
    } catch (error) {
      return response
        .status(404)
        .send({ message: 'Erro ao tentar atualziar categoria' })
    }
  }

  public async destroy({ bouncer, request, response }: HttpContextContract) {
    const category = await Category.findOrFail(request.param('id'))

    await bouncer.with('CategoryPolicy').authorize('delete')

    try {
      // await bucket.file(`categories/${category.imageName}`).delete()
      // await bucket.file(`categories/${category.iconName}`).delete()

      await Drive.delete(`categories/${category.imageName}`)
      await Drive.delete(`categories/${category.iconName}`)
    } catch (error) {
      console.log('deleteFiles erro: ', error)
    }

    await category.delete()

    return response.send({ message: 'Categoria apagado com sucesso' })
  }

  public async deleteImages({
    bouncer,
    request,
    response,
  }: HttpContextContract) {
    const id = request.param('id')
    const { all, index, image_name } = request.all()
    const category = await Category.findOrFail(id)
    console.log({ all, index, image_name })

    await bouncer.with('CategoryPolicy').authorize('delete')

    try {
      if (all) {
        // await bucket.deleteFiles({
        //   prefix: `categories/${id}/`,
        // })

        await Drive.delete(`categories/${id}/`)

        category.iconName = ''
        category.iconUrl = ''
        category.imageName = ''
        category.imageUrl = ''

        await category.save()

        return response.send({ message: 'Images apagadas com sucesso' })
      } else {
        // const file = bucket.file(`categories/${image_name}`)
        // await file.delete()

        await Drive.delete(`categories/${image_name}`)

        if (category.imageName === image_name) {
          category.imageName = ''
          category.imageUrl = ''
        } else {
          category.iconName = ''
          category.iconUrl = ''
        }

        await category.save()

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
