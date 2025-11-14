export function transParams(params: { [key: string]: any }): string {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            const subPart = encodeURIComponent(`${propName}[${key}]`) + '='
            result += `${subPart}${encodeURIComponent(value[key])}&`
          }
        }
      } else {
        result += `${part}${encodeURIComponent(value)}&`
      }
    }
  }
  return result
}
