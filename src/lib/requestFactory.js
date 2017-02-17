let uniqueId = 0

const requestFactory = function requestFactory(params) {
  uniqueId += 1

  const request = {
    id: uniqueId,
    params,
  }

  return request
}

export default requestFactory
