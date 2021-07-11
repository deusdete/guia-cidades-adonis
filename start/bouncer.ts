import Store from 'App/Models/Store'
import User from 'App/Models/User'

import Bouncer from '@ioc:Adonis/Addons/Bouncer'


export const { actions } = Bouncer

/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({
    StorePolicy: () => import('App/Policies/StorePolicy'),
    EventPolicy: () => import('App/Policies/EventPolicy'),
    BannerPolicy: () => import('App/Policies/BannerPolicy'),
    CategoryPolicy: () => import('App/Policies/CategoryPolicy'),
    UserPolicy: () => import('App/Policies/UserPolicy'),
    PlansPolicy: () => import('App/Policies/PlansPolicy'),
    SubscriptionsPolicy: () => import('App/Policies/SubscriptionsPolicy'),
})
