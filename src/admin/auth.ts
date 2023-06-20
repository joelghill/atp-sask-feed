import AtpAgent from '@atproto/api'
import { AppContext } from '../config.js'

/**
 * The ATP authenticator. Authenticates users against the ATP server.
 */
export class AtpAuthenticator {
  private atpAgent: AtpAgent.AtpAgent

  /**
   * Initialize the ATP authenticator.
   * @param ctx The app context.
   */
  constructor(private ctx: AppContext) {
    // TODO replace with context config setting
    this.atpAgent = new AtpAgent.AtpAgent({ service: 'https://bsky.social' })
  }

  /**
   * Authenticate a user with the given credentials against the ATP server.
   * @param email Admin user's email or username
   * @param password The admin user's password
   * @returns A user object if the credentials are valid, or null if they are not.
   */
  async authenticate(email: string, password: string) {

    try {
        const result = await this.atpAgent.login({ identifier: email, password })
        // Check the DID to make sure it's the admin's
        if (result.data.did != this.ctx.cfg.adminDid) {
          console.error("Authenticated user's DID does not match admin DID")
          return null
        }
        else {
          console.log("Authenticated admin user: " + result.data.did)
        }

        // TODO: Eventually replace this with a call to the user database to get roles
        return {
            email: result.data.email,
            handle: result.data.handle,
            did: result.data.did,
        }
    }
    catch (e) {
        console.error(e)
        return null
    }
  }
}
