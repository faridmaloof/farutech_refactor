/**
 * Auth Screens - Farutech Design System
 * 
 * Pantallas de autenticación reutilizables:
 * - Login
 * - Register
 * - ForgotPassword
 * 
 * Cada pantalla recibe el endpoint/callback por props,
 * sin backend fijo embebido.
 */

export { LoginScreen } from './LoginScreen'
export { RegisterScreen } from './RegisterScreen'
export { ForgotPasswordScreen } from './ForgotPasswordScreen'

export type {
  LoginScreenProps,
  RegisterScreenProps,
  ForgotPasswordScreenProps,
  AuthScreenConfig,
} from './types'
