export const getQueryParameter = (parameterName: string) => {
  return new URLSearchParams(window.location.search).get(parameterName)
}
