import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class CategoryPolicy extends BasePolicy {
	public async before(user: User | null) {
		if (user && user.isAdmin === 1) {
		  return true
		}
	  }
	public async create(user: User) {
		if (user && user.isAdmin === 1) {
			return true
		} 
		
		return false
	}
	public async update(user: User) {
		if (user && user.isAdmin === 1) {
			return true
		  }
	}
	public async delete(user: User) {
		if (user && user.isAdmin === 1) {
			return true
		  }
	}

	public async after(action, actionResult) {
		if (actionResult.authorized) {
			console.log(`${action} was authorized`)
		  } else {
			console.log(`${action} denied with "${actionResult.errorResponse}" message`)
		  }
	}
}
