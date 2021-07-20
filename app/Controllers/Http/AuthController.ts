import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
export default class AuthController {
  async login({request, auth, response}: HttpContextContract){
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)

      return token
    } catch(error) {
      console.log(error)
      return response.badRequest({message: 'Invalid credentials'})
    }
  }

  async register({bouncer, request, response}: HttpContextContract){
    const body = request.only(['email', 'password', 'isManager', 'isUser'])

    
    await bouncer
      .with('UserPolicy')
      .authorize('create')

    try {

      const userExist = await User.findBy('email', body.email)

      if(userExist){
        return response.badRequest({message: 'Usuário já existe'})
      }

      const user = await User.create(body)
      return response.send({message: 'Usuário criando com sucesso', user})
    } catch(error) {
      console.log(error)
      return response.badRequest({message: 'Erro ao tentar criar usuário'})
    }
  }

  async logout({auth}: HttpContextContract){
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }

}
