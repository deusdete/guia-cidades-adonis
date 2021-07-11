import Route from '@ioc:Adonis/Core/Route'

Route.resource('subscriptions', 'SubscriptionsController')
  .apiOnly()
  .middleware({
    index: 'auth',
    show: 'auth',
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })
