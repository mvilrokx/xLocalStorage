import iFrameFactory from './iFrameFactory'
import requestFactory from './requestFactory'

const clientFactory = function clientFactory(options) {
  // PRIVATE
  let targetOrigin = '*'
  let iframe
  let server
  let connected = false
  let connectPromiseResolve
  const connectedEvent = new Event('connected')
  const disconnectedEvent = new Event('disconnected')
  const requests = []

  const defaultOptions = {
    timeout: 5000, // ms
  }

  const config = Object.assign({}, defaultOptions, options)

  const messageListener = (messageEvent) => {
    if (messageEvent.data === 'x-local-storage-ready') {
      connected = true
      document.dispatchEvent(connectedEvent)
      connectPromiseResolve()
    } else if (requests[messageEvent.data.id]) {
      // Fullfil promise created on request
      requests[messageEvent.data.id](messageEvent.data.error, messageEvent.data.response)
    }
  }

  const request = (params) => {
    const req = requestFactory(params)

    return new Promise((resolve, reject) => {
      // This will reject the request if it takes to long to fullfill
      const timeout = setTimeout(() => {
        if (!requests[req.id]) return
        delete requests[req.id]
        reject(new Error('Timeout: could not perform your request.'))
      }, config.timeout)

      // This will get called when receiving the response from the postMessage,
      // fullfilling the promise and removing the timeout set above to avoid reject
      requests[req.id] = (err, result) => {
        /* eslint consistent-return: 0 */
        clearTimeout(timeout)
        delete requests[req.id]
        if (err) return reject(new Error(err))
        resolve(result)
      }

      server.postMessage(req, targetOrigin)
    })
  }


  // PUBLIC
  const connect = url => new Promise((resolve, reject) => {
    try {
      targetOrigin = url
      iframe = iFrameFactory({ src: url })
      // Note that this might error out with a net::ERR_CONNECTION_REFUSED
      // when the url of the iFrame is unreachable.  This error DOES NOT
      // get caught by the catch block unfortunately (this is by design as per browser specs)
      // This is why we check manually if the connection works, by having the
      // iframe send a postMessage to this page and only if we receive that message
      // do we set connected = true
      document.body.appendChild(iframe) // Side Effect!!! ¯\_(ツ)_/¯

      server = iframe.contentWindow

      window.addEventListener('message', messageListener, false)
      connectPromiseResolve = resolve
    } catch (err) {
      reject(err)
    }
  })

  const disconnect = () => {
    iframe.parentNode.removeChild(iframe) // This works on ALL platforms
    window.removeEventListener('message', messageListener, false)
    connected = false
    document.dispatchEvent(disconnectedEvent)
  }

  const isConnected = () => connected

  const on = (event, cb) => document.addEventListener(event, cb, false)

  const clear = () => request()

  const getItem = key => request(key)

  const setItem = dataObject => request(dataObject)

  const removeItem = key => request({ x_delete: key })

  const getItems = keys => request(keys)

  const setItems = dataObjects => request(dataObjects)

  const removeItems = keys => request({ x_delete: keys })

  return {
    connect,
    disconnect,
    isConnected,
    on,
    getItem,
    getItems,
    setItem,
    setItems,
    removeItem,
    removeItems,
    clear,
  }
}

export default clientFactory
