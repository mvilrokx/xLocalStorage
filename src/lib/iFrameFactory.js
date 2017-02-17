const iFrameFactory = function iFrameFactory(options) {
  const defaultOptions = {
    id: 'x-local-storage',
    loadEventListener() {
      return () => {
        // TODO: Put something usefull here
      }
    },
  }

  const defaultStyles = {
    display: 'none',
    position: 'absolute',
    top: '-999px',
    left: '-999px',
  }

  const defaultLoadEventListener = () => {
    const iFrameReadyEvent = new Event('x-local-storage-ready')
    parent.document.dispatchEvent(iFrameReadyEvent)
  }

  const config = Object.assign({}, defaultOptions, options)
  const styles = Object.assign({}, defaultStyles, options.styles)

  const iFrame = document.createElement('iframe')

  iFrame.id = config.id
  iFrame.addEventListener('load', defaultLoadEventListener)
  iFrame.addEventListener('load', config.loadEventListener(iFrame))

  iFrame.src = config.src
  Object.assign(iFrame.style, styles)

  return iFrame
}

export default iFrameFactory
