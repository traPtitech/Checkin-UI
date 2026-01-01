import type { LocationQueryValue } from 'vue-router'

export const parseRouteQuery = (query: LocationQueryValue | LocationQueryValue[]) => {
  if (Array.isArray(query)) {
    return query.filter((v): v is string => typeof v === 'string')
  } else {
    return typeof query === 'string' ? [query] : ['']
  }
}

export const parseRedirectQuery = (query: LocationQueryValue | LocationQueryValue[]) => {
  return parseRouteQuery(query)[0] || '/'
}
