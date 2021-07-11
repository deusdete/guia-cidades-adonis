import Route from '@ioc:Adonis/Core/Route'


Route.resource('banner', 'BannersController')
  .apiOnly()
  .middleware({
    index: 'guest',
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })

