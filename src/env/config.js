import { ImplementationException } from '../consts/exceptions'

export const getEnvSafely = (envVal, envKey) => {

  if (!envVal)
    throw new ImplementationException(`Missing variable ${envKey}!`, { envKey, envVal })

  return envVal
}
