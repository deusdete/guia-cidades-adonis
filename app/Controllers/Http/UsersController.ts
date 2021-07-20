import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";

export default class UsersController {
    async index() {
        const users = User.query().preload('subscription')

        return users
    }

    async update({bouncer, auth, request, response}: HttpContextContract){
      const user = await User.findOrFail(request.param('id'))

      const body = request.only(['email', 'is_manager', 'is_user', 'password', 'new_password'])

      await bouncer
        .with('UserPolicy')
        .authorize('update', user)

      if(body.new_password && body.password){
        await auth.use('api').attempt(body.email, body.password)
        user.email = body.email
        user.isManager = body.is_manager
        user.isUser = body.is_user
        user.password = body.new_password
  
        await user.save()
  
        return response.send({messege: 'Usuário atualizado com sucesso'})
      }else{
        user.email = body.email
        user.isManager = body.is_manager
        user.isUser = body.is_user
  
        await user.save()
  
        return response.send({messege: 'Usuário atualizado com sucesso'})
      }

    }

    async show({bouncer, request}: HttpContextContract) {
      const user = await User.findOrFail(request.param('id'))

      await bouncer
        .with('UserPolicy')
        .authorize('view', user)

      return user
    }

    async profile({ bouncer, auth, response}: HttpContextContract){
      console.log('auth')
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

    async destroy ({bouncer, request, response}: HttpContextContract){
      const user = await User.findOrFail(request.param('id'))

      await bouncer
            .with('UserPolicy')
            .authorize('delete')

      await user.delete()
 
      return response.send({messege: 'Uusário apagado com sucesso'})
    }
}
