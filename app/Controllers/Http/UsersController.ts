import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";

export default class UsersController {
    async index() {
        const users = User.query().preload('subscription')

        return users
    }

    async update({bouncer, request, response}: HttpContextContract){
      const user = await User.findOrFail(request.param('id'))

      const body = request.only(['email', 'isManager', 'isUser'])

      await bouncer
        .with('UserPolicy')
        .authorize('update', user)

      if(user.email !== body.email){
        const emailExist = await User.findBy('email', body.email)

        if(emailExist){
          return response.status(401).send({messge: 'Já existe um usuário com esse email'})
        }
      }

      user.email = body.email
      user.isManager = body.isManager
      user.isUser = body.isUser

      await user.save()

      return response.send({messege: 'Usuário atualizado com sucesso'})
  

    }

    async show({bouncer, request}: HttpContextContract) {
      const user = await User.findOrFail(request.param('id'))

      await bouncer
        .with('UserPolicy')
        .authorize('view', user)

      return user
    }

    async profile({ bouncer, auth, response}: HttpContextContract){
      if(auth.isLoggedIn){
          const user = await User.findOrFail(auth.user?.id)

          await bouncer
            .with('UserPolicy')
            .authorize('view', user)

          return response.send(user)
      }else{
          return response.status(401).send({messege: 'Não autenticado'})
      }
    }

    async delete ({bouncer, request, response}: HttpContextContract){
      const user = await User.findOrFail(request.param('id'))

      await bouncer
            .with('UserPolicy')
            .authorize('delete')

      await user.delete()
 
      return response.send({messege: 'Uusário apagado com sucesso'})
    }
}
