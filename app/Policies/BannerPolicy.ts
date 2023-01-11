import { action, BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Banner from 'App/Models/Banner'
import User from 'App/Models/User'

export default class BannerPolicy extends BasePolicy {
    public async before(user: User | null) {
		if (user && user.isAdmin) {
		  return true
		}
	  }

	@action({ allowGuest: true })
	public async view(user: User, banner: Banner) {
		if (banner.status) {
			return true
		  }
	  
		  if (!user) {
			return false
		  }
	  
		  return banner.user_id === user.id
	}
	public async create(user: User) {
		if (!user) {
			return false
		}

		return true
	}

	public async update(user: User, banner: Banner) {
		return banner.user_id === user.id
	}
	public async delete(user: User, banner: Banner) {
		return banner.user_id === user.id
	}

    // public async after(action, actionResult) {
	// 	if (actionResult.authorized) {
	// 		console.log(`${action} was authorized`)
	// 	  } else {
	// 		console.log(`${action} denied with "${actionResult.errorResponse}" message`)
	// 	  }
	// }
}
