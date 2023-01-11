import Route from '@ioc:Adonis/Core/Route'

Route.resource('category', 'CategoriesController')
  .apiOnly()
  .middleware({
    index: "guest",
    show: "guest",
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })

Route.delete('category/:id/images', 'CategoriesController.deleteImages')
  .middleware('auth')
