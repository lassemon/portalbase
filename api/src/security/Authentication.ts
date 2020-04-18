import { PassportStatic } from 'passport'
import * as express from 'express'
import { IJwtPayload, IUser } from 'interfaces/user'
import { isEmpty } from 'lodash'
import { Strategy, StrategyOptions, VerifiedCallback } from 'passport-jwt'
import UserService from 'services/UserService'
import { TsoaRoute } from 'tsoa'

export default class Authentication {
  private passport: PassportStatic
  private static instance: Authentication

  constructor(passport: PassportStatic) {
    this.passport = passport
    this.init()
  }

  private init = () => {
    if (!Authentication.instance) {
      const userService = new UserService()

      const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
          token = req.cookies.token
        }
        return token
      }

      const options: StrategyOptions = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET || 'my@#$secret'
      }

      this.passport.use(
        new Strategy(options, async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
          try {
            const result = (await userService.findById(jwtPayload.user)) as IUser

            if (isEmpty(result)) {
              return done(result, false)
            }

            if (!result) {
              return done(null, false)
            } else {
              return done(null, result, { issuedAt: jwtPayload.iat })
            }
          } catch (error) {
            return done(error, false)
          }
        })
      )

      Authentication.instance = this
    }
  }

  public getAuthMiddleware = () => {
    return (scopes: string[], authCallback: (...args: any[]) => any): Promise<void> => {
      console.log('auth CALLBACK', authCallback)
      const auth = this.passport.authenticate('jwt', { session: false, scope: scopes }, authCallback)
      console.log('auth typeof', typeof auth)
      return auth
    }
  }

  public getPassport() {
    return this.passport
  }
}

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  authMiddleware: (scopes: string[], authCallback: (...args: any[]) => any) => any,
  authCallback: (...args: any[]) => any,
  scopes?: string[]
): Promise<any> {
  console.log('request body', request.body)
  console.log('securityName', securityName)
  console.log('scopes', scopes)
  return authMiddleware(scopes, authCallback)
}
