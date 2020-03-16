import Cookies from 'universal-cookie';

declare global {
  namespace Express {
    export interface Request {
       universalCookies?: Cookies
    }
  }
}