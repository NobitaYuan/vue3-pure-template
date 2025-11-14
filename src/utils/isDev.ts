const isDev = import.meta.env.MODE === 'development'
const isProduction = import.meta.env.MODE === 'production'

export { isDev, isProduction }
