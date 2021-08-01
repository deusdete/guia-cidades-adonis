import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle ({auth}: HttpContextContract, next: () => Promise<void>) {
    if(await auth.check()){
      await next()
    }else{
      await next()
    }
   
  }
}
