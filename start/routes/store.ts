import Route from '@ioc:Adonis/Core/Route'

Route.resource('store', 'StoresController')
  .apiOnly()
  .middleware({
    index: 'guest',
    show: 'auth',
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })

Route.get('store/all/list', 'StoresController.allList')
  .middleware('auth')
Route.delete('store/:id/images', 'StoresController.deleteImages')
  .middleware('auth')