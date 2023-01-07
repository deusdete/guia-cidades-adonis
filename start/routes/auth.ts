import Route from '@ioc:Adonis/Core/Route'

Route.post('login', 'AuthController.login')
Route.post('logout', 'AuthController.logout')
Route.post('register', 'AuthController.register').middleware('auth')
Route.post('register/super', 'AuthController.registerSuper')
