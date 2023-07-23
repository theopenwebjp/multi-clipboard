import MultiClipboard from "../src/index.js"
window.addEventListener('load', onLoad)
function onLoad() {
    update()
}
function getData() {
    const textData = /** @type {HTMLInputElement} */(document.getElementById('data')).value
    const arrayData = JSON.parse(textData);
    if (!arrayData) {
        throw new Error('Invalid data')
    }
    return arrayData
}
function getOptions() {
    // return { shift: true, sync: true }
    const options = {}

    options.sync = /** @type {HTMLInputElement} */(document.getElementById('sync')).checked

    const dataPoppingElement = /** @type {HTMLInputElement|undefined} */ (Array.from(document.getElementsByName('data-popping')).filter(i => i instanceof HTMLInputElement && i.checked)[0])
    const dataPopping = dataPoppingElement ? dataPoppingElement.value : ''
    if (dataPopping === 'shift') {
        options.shift = true
    } else if (dataPopping === 'pop') {
        options.pop = true
    }

    return options
}
const w = /** @type {any} */ (window);
function update() {
    console.debug('update')
    const mClipboard = new MultiClipboard()
    const data = getData()
    const options = getOptions()
    mClipboard.set(data).startWatching(options)
    w.mClipboard = mClipboard
    console.log(mClipboard, 'Check window.mClipboard', { options })
}
w.update = update
