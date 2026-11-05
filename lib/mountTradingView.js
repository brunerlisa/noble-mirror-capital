/**
 * Mount a TradingView embed as a real iframe.
 * The external script was leaving an empty box when it ran before layout
 * or when document.currentScript could not read the config.
 */
function widgetName(src) {
  const file = src.split('/').pop() || src
  return file.replace(/^embed-widget-/, '').replace(/\.js$/, '')
}

export function mountTradingView(container, { src, config, onReady }) {
  let cancelled = false
  let timer = 0
  let attempts = 0

  const inject = () => {
    if (cancelled || !container.isConnected) return

    const width = container.clientWidth
    const height = container.clientHeight
    const payload = {
      ...config,
      locale: config.locale || 'en',
      ...(config.autosize
        ? { width: '100%', height: '100%' }
        : {
            width: width > 0 ? width : (config.width ?? '100%'),
            height: height > 0 ? height : (config.height ?? '100%'),
          }),
    }

    const iframe = document.createElement('iframe')
    iframe.title = 'TradingView market data'
    iframe.src = `https://www.tradingview-widget.com/embed-widget/${widgetName(src)}/?locale=${encodeURIComponent(payload.locale)}#${encodeURIComponent(JSON.stringify(payload))}`
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = '0'
    iframe.style.display = 'block'
    iframe.setAttribute('allowtransparency', 'true')
    iframe.setAttribute('scrolling', 'no')
    iframe.loading = 'eager'
    iframe.addEventListener('load', () => {
      if (!cancelled) onReady?.()
    })

    container.replaceChildren(iframe)
  }

  const tick = () => {
    if (cancelled) return
    const sized = container.clientWidth > 0 && container.clientHeight > 0
    if (sized || attempts > 30) {
      inject()
      return
    }
    attempts += 1
    timer = window.setTimeout(tick, 50)
  }

  timer = window.setTimeout(tick, 0)

  return () => {
    cancelled = true
    window.clearTimeout(timer)
    container.replaceChildren()
  }
}
