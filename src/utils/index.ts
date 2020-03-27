export function debounce (fn: Function, wait = 20) {
  let timeout: any = null
  return function () {
    if (timeout !== null) { clearTimeout(timeout) }
    timeout = setTimeout(fn, wait)
  }
}
