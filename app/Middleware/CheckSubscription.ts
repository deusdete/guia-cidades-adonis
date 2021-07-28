import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Plan from 'App/Models/Plan'

export default class CheckSubscription {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const userId: any = ctx.auth.user?.id

    if(ctx.auth.user?.isAdmin === 1){
      return next()
    }

    const plansDATA = await Plan.query().preload('subscription', (subscriptionQuery) => {
      subscriptionQuery.where('user_id', '=', userId)
    }).limit(1)

    if(plansDATA[0].$preloaded.subscription[0].active_stores === plansDATA[0].max_stores ){
      ctx.response.unauthorized({ error: `Numero máximo de lojas utilizada. Entre em contato com o administrador para alterar plano` })
      return
    }

    if(plansDATA[0].$preloaded.subscription[0].active_events === plansDATA[0].max_events ){
      ctx.response.unauthorized({ error: `Numero máximo de eventos utilizado. Entre em contato com o administrador para alterar plano` })
      return
    }
    
    if(
        plansDATA[0].allow_create_banner !== 0 && 
        (plansDATA[0].$preloaded.subscription[0].active_banner === plansDATA[0].max_banners)
      ){
        ctx.response.unauthorized({ error: `Numero máximo de banner utilizado. Entre em contato com o administrador para alterar plano` })
      return
    }
    ctx.subscriptionId = plansDATA[0].$preloaded.subscription[0].id
    await next()
  }
}
