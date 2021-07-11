import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Plan from "App/Models/Plan"

export default class PlansController {
  async index({ auth, bouncer,request, response }: HttpContextContract) {
    const {subscriptions, user} = request.all()

    await bouncer
      .with('PlansPolicy')
      .authorize('view')

    try {
      let plansDATA: any = []
      const userId: any = auth.user?.id
      if(subscriptions === 'true'){
        plansDATA = await Plan.query().preload('subscription', (subscriptionQuery) => {
          subscriptionQuery.where('user_id', '=', userId)
        })
      }else{
        plansDATA = await Plan.all()
      }
      

      return plansDATA.map(plan => plan.serialize())

    } catch (error) {
      console.log(error)
      return response.status(401).send({messege: 'Erro ao buscar planos'})
    }
  }

  async subscriptionsPlan({ bouncer, response }: HttpContextContract) {

    await bouncer
      .with('PlansPolicy')
      .authorize('view')

    try {
      const plansDATA = await Plan.query().preload('subscription')

      return plansDATA.map(plan => plan.serialize())

    } catch (error) {
      console.log(error)
      return response.status(401).send({messege: 'Erro ao buscar planos'})
    }
  }
   
    
  async store({ bouncer, request, response }: HttpContextContract) {

    const body = request.all()

    await bouncer
      .with('PlansPolicy')
      .authorize('create')

      const plan = {
        name: body.name,
        description: body.description,
        frequency: body.frequency,
        frequency_type: body.frequency_type,
        value: body.value,
        repetitions: body.repetitions,
        free_trial: JSON.stringify(body.free_trial), 
        max_stores: body.max_stores,
        max_events: body.max_events,
        max_banners: body.max_banners,
        allow_create_banner: body.allow_create_banner,
      }

          
      await Plan.create(plan)

      return response.status(201).send({message: 'Plano criado com sucesso'})


  }
  
  async show({request}: HttpContextContract){
    const plan = await Plan.findOrFail(request.param('id'))

    return plan
  }
  
  public async update({ bouncer, request, response }: HttpContextContract) {

    const plan = await Plan.findOrFail(request.param('id'))
    const body = request.all()

    await bouncer
      .with('PlansPolicy')
      .authorize('update')

    try {

        plan.name =  body.name,
        plan.description =  body.description,
        plan.frequency = body.frequency,
        plan.frequency_type = body.frequency_type,
        plan.value = body.value,
        plan.repetitions = body.repetitions,
        plan.free_trial = body.free_trial, 
        plan.max_stores = body.max_stores,
        plan.max_events = body.max_events,
        plan.max_banners = body.max_banners,
        plan.allow_create_banner = body.allow_create_banner,

        await plan.save()
          

      return response.send({message: 'Plano atualizado com suceso'})
    } catch (error) {
      return response.status(404).send({message: 'Erro ao tentar atualziar plano'})
    }
  }
  
  
  public async destroy({ bouncer, request, response }: HttpContextContract) {

    const plan = await Plan.findOrFail(request.param('id'))

    await bouncer
      .with('PlansPolicy')
      .authorize('delete')


    await plan.delete()

    return response.send({ message: 'Plano apagado com sucesso' })
  }
  
}
