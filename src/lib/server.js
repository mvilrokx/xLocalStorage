const server = function server() {
  // PRIVATE
  const targetOrigin = '*'

  const clear = () => localStorage.clear()
  const getItem = key => localStorage.getItem(key)
  const removeItem = key => localStorage.removeItem(key)
  const setItem = (key, value) => localStorage.setItem(key, value)

  const getItems = keys => keys.map(getItem)
  const removeItems = keys => keys.forEach(removeItem)
  const setItems = (data) => {
    data.map(dataObject =>
      Object.keys(dataObject).forEach((key) => {
        setItem(key, dataObject[key])
      }),
    )
  }

  const messageListener = (messageEvent) => {
    let error
    if (messageEvent.data === 'x-local-storage-ready') return
    const requestData = messageEvent.data.params
    const responseData = {
      id: messageEvent.data.id,
      error,
      response: [],
    }

    // Dispatch the request
    if (!requestData || requestData === null) {
      clear()
    } else if (typeof requestData !== 'object') {
      responseData.response.push(...getItems([requestData]))
    } else if (requestData.x_delete) {
      if (Array.isArray(requestData.x_delete)) {
        removeItems(requestData.x_delete)
      } else {
        removeItem([requestData.x_delete])
      }
    } else if (Array.isArray(requestData)) {
      if (typeof requestData[0] === 'object') {
        setItems(requestData)
      } else {
        responseData.response.push(...getItems(requestData))
      }
    } else {
      setItems([requestData])
    }

    if (responseData.response.length > 1) {
      responseData.response = responseData.response
    } else {
      responseData.response = responseData.response[0]
    }
    window.parent.postMessage(responseData, targetOrigin)
  }

  window.addEventListener('message', messageListener, false)
  // Announce readiness to client
  window.parent.postMessage('x-local-storage-ready', targetOrigin)
}

export default server
