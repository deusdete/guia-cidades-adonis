import { action, BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Event from 'App/Models/Event'

export default class EventPolicy extends BasePolicy {
    public async before(user: User | null) {
		if (user && user.isAdmin === 1) {
		  return true
		}
	  }

	@action({ allowGuest: true })
	public async view(user: User, event: Event) {
		if (event.status === 1) {
			return true
		  }
	  
		  if (!user) {
			return false
		  }
	  
		  return event.user_id === user.id
	}
	public async create(user: User) {
		if (!user) {
			return false
		}

		return true
	}

	public async update(user: User, event: Event) {
		return event.user_id === user.id
	}
	public async delete(user: User, event: Event) {
		return event.user_id === user.id
	}

    // public async after(action, actionResult) {
	// 	if (actionResult.authorized) {
	// 		console.log(`${action} was authorized`)
	// 	  } else {
	// 		console.log(`${action} denied with "${actionResult.errorResponse}" message`)
	// 	  }
	// }
}
