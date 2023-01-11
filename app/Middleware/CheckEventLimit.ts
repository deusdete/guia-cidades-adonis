import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Plan from 'App/Models/Plan'

export default class CheckSubscription {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const userId: any = ctx.auth.user?.id

    if(ctx.auth.user?.isAdmin){
      return next()
    }

    const plansDATA = await Plan.query().preload('subscription', (subscriptionQuery) => {
      subscriptionQuery.where('user_id', '=', userId)
    }).limit(1)

    if(plansDATA[0].$preloaded.subscription[0].active_events === plansDATA[0].max_events){
      ctx.response.unauthorized({ error: `Numero máximo de eventos utilizado. Entre em contato com o administrador para alterar plano` })
      return
    }
    
    ctx.subscriptionId = plansDATA[0].$preloaded.subscription[0].id
    await next()
  }
}
