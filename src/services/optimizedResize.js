function throttle(type, name, obj) {
  obj = obj || window
  let running = false
  const eventHandler = e => {
    if (running) return
    running = true
    requestAnimationFrame(() => {
      obj.dispatchEvent(new CustomEvent(name, e))
      running = false
    })
  }
  obj.addEventListener(type, eventHandler)
}

throttle('resize', 'optimizedResize')
