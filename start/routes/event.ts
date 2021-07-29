import Route from '@ioc:Adonis/Core/Route'

Route.resource('event', 'EventsController')
  .apiOnly()
  .middleware({
    index: 'guest',
    store: ['auth', 'eventLimit'],
    update: 'auth',
    destroy: 'auth'
  })
Route.get('event/all/list', 'EventsController.allList')
Route.delete('event/:id/images', 'EventsController.deleteImages').middleware('auth')