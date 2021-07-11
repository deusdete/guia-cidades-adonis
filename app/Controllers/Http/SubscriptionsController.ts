import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Subscription from 'App/Models/Subscription'

export default class SubscriptionsController {
    async index({ bouncer, response }: HttpContextContract) {
        await bouncer
            .with('SubscriptionsPolicy')
            .authorize('view')

        try {
          const subscriptionDATA = await Subscription.all()
    
          return subscriptionDATA.map(subscription => subscription.serialize())
    
        } catch (error) {
            console.log(error)
            return response.status(401).send({messege: 'Erro ao buscar pro inscritos'})
        }
      }
        
      async store({ bouncer, request, response }: HttpContextContract) {
    
        const body = request.all()
    
        await bouncer
          .with('SubscriptionsPolicy')
          .authorize('create')
    
          const subscription = {
            plan_id: body.plan_id,
            user_id: body.user_id,
            active_stores: body.active_stores,
            active_events: body.active_events,
            active_banner: body.active_banner,
            status: body.status,
            start_date: body.start_date,
            end_date: body.end_date,
          }
    
              
          await Subscription.create(subscription)
    
          return response.status(201).send({message: 'Inscrição criada com sucesso'})
    
    
      }
      
      async show({request}: HttpContextContract){
        const subscription = await Subscription.findOrFail(request.param('id'))
    
        return subscription
      }
      
      public async update({ bouncer, request, response }: HttpContextContract) {
    
        const subscription = await Subscription.findOrFail(request.param('id'))
        const body = request.all()
    
        await bouncer
          .with('PlansPolicy')
          .authorize('update')
    
        try {
    
            subscription.plan_id = body.user_id,
            subscription.user_id = body.user_id,
            subscription.active_stores = body.active_stores,
            subscription.active_events = body.active_events,
            subscription.active_banner = body.active_banner,
            subscription.status = body.status,
            subscription.start_date = body.start_date,
            subscription.end_date = body.end_date,
    
            await subscription.save()
              
    
          return response.send({message: 'Plano atualizado com suceso'})
        } catch (error) {
          return response.status(404).send({message: 'Erro ao tentar atualziar plano'})
        }
      }
      
      
      public async destroy({ bouncer, request, response }: HttpContextContract) {
    
        const subscription = await Subscription.findOrFail(request.param('id'))
    
        await bouncer
          .with('PlansPolicy')
          .authorize('delete')
    
    
        await subscription.delete()
    
        return response.send({ message: 'Inscrição apagado com sucesso' })
      }
}
