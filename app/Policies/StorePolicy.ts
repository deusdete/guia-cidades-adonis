import { action, BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Store from 'App/Models/Store'

export default class StorePolicy extends BasePolicy {
	public async before(user: User | null) {
		if (user && user.isAdmin === 1) {
		  return true
		}
	}

	@action({ allowGuest: true })
	public async view(user: User, store: Store) {
		if (store.status === 1) {
			return true
		  }
	  
		  if (!user) {
			return false
		  }
	  
		  return store.user_id === user.id
	}
	public async create(user: User) {
		if (!user) {
			return false
		}
	}

	public async update(user: User, store: Store) {
		return store.user_id === user.id
	}
	public async delete(user: User, store: Store) {
		return store.user_id === user.id
	}

	public async after(action, actionResult) {
		if (actionResult.authorized) {
			console.log(`${action} was authorized`)
		  } else {
			console.log(`${action} denied with "${actionResult.errorResponse}" message`)
		  }
	}
}
