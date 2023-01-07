import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
    public async before(user: User | null) {
        if (user && user.isAdmin) {
            return true
        }
    }

    public async view(user: User, userAuth: User) {
		console.log(user.id === userAuth.id)
        return user.id === userAuth.id
	}
	public async create(user: User) {
		if (user && user.isAdmin) {
			return true
		} 
		
		return false
	}
	public async update(user: User, userAuth: User) {
        return user.id === userAuth.id
	}
	public async delete(user: User) {
		if (user && user.isAdmin) {
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
