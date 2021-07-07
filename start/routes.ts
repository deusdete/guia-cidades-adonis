/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('login', 'AuthController.login')
Route.post('register', 'AuthController.register')

Route.resource('category', 'CategoriesController')
  .apiOnly()
  .middleware({
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })

Route.resource('store', 'StoresController')
  .apiOnly()
  .middleware({
    index: 'guest',
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })

Route.get('store/all/list', 'StoresController.allList')
  .middleware('auth')
Route.delete('store/:id/images', 'StoresController.deleteImages')
  .middleware('auth')

Route.resource('banner', 'BannersController')
  .apiOnly()
  .middleware({
    index: 'guest',
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })

Route.resource('event', 'EventsController')
  .apiOnly()
  .middleware({
    index: 'guest',
    store: 'auth',
    update: 'auth',
    destroy: 'auth'
  })
Route.get('event/all/list', 'EventsController.allList')
Route.delete('event/:id/images', 'EventsController.deleteImages')


Route.get('home', 'HomeController.index')
 
 