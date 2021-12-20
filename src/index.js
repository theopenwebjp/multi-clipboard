/**
 * @typedef {{ sync?: boolean, shift?: boolean, pop?: boolean, stopPasteOnEnd?: boolean, stopCopyOnEnd?: boolean, stopCutOnEnd?: boolean }} WatchOptions ONLY one of shift and pop may be set at same time.
 */

/**
* Class for handling multi copy and paste features.
* Can sync with clipboard.
* @example {(new MultiClipboard()).set([1,2,3]).startWatching({ shift: true, sync: true })} This SHOULD output 1 then 2 then 3 and then be empty both in browser and elsewhere.
*/
export default class MultiClipboard {
  /**
  * Settings MAY be passed in future.
  */
  constructor() {
    /**
    * @type {string[]}
    */
    this.data = []
    /**
    * @type {Record<string, function>}
    */
    this.listeners = {}
  }

  get() {
    return this.data
  }

  /**
   * get + removes first
   */
  shift() {
    return this.data.shift()
  }

  /**
  * get + removes last
  */
  pop() {
    return this.data.pop()
  }

  /**
  * Sets from data. SHOULD pass array.
  * CHAINABLE
  * @param {string[]} data
  */
  set(data) {
    this.data = data
    return this
  }

  /**
  * Sets from text.
  * Uses the following format: "A,B,C,...". The ability to do CSV with quote marks and escaping as spreadsheets do IS RESERVED for usage.
  * CHAINABLE
  * @param {string} text
  */
  setText(text) {
    // Parse data
    const data = text.split(',').map(i => i.trim()).filter(i => i)
    this.data = data
  }

  /**
  * @param {DataTransfer} data
  */
  setDataTransfer(data) {
    const text = data.getData('text')
    this.setText(text)
    console.debug('setDataTransfer', { data, text })
  }

  /**
  * CHAINABLE
  */
  clear() {
    this.data = []
    return this
  }

  /**
  * CHAINABLE
  * Watches copy, cut and paste events and handles based on settings.
  * Use "stopWatching" to cancel.
  * @param {WatchOptions} [options]
  */
  startWatching(options = {}) {
    // OPTIONS
    const d = /** @param {any} v */ (v, def = undefined) => v !== undefined ? v : def
    const shift = d(options.shift, false)
    const pop = d(options.pop, false)
    const sync = d(options.sync, false)
    const stopCopyOnEnd = d(options.stopCopyOnEnd, true)
    const stopCutOnEnd = d(options.stopCutOnEnd, true)
    const stopPasteOnEnd = d(options.stopPasteOnEnd, true)

    // CHECKS
    const isAlreadyWatching = Object.keys(this.listeners).length > 0
    if (isAlreadyWatching) {
      console.warn('startWatching ignored because already watching')
      return
    }
    if (shift && pop) {
      throw new Error('Can not simultaneously set shift and pop.')
    }

    /**
    * KEYBOARD SHORTCUT LISTENER
    */
    const keyboardShortcutListener = (event) => {
      if (event.ctrl && event.code === 'KeyC') { // COPY
        //
      } else if (event.ctrl && event.code === 'KeyX') { // CUT
        //
      } else if (event.ctrl && event.code === 'KeyV') { // PASTE
        //
      }
    }
    document.addEventListener('keydown', keyboardShortcutListener)
    this.listeners['keydown'] = keyboardShortcutListener

    /**
    * This should apply data at current selection OR focus.
    * @param {string} data
    */
    const applyToCurrentSelection = (data = '') => {
      if (!data) { // No undefined OR null
        data = ''
      }
      const { activeElement } = document
      if (activeElement) {
        const VALUE_ELEMENTS = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement]
        const isValueElement = /** @type {HTMLElement} e */ (e) => VALUE_ELEMENTS.filter(i => e instanceof i).length > 0
        if (isValueElement(activeElement)) {
          activeElement.value += data
        } else {
          activeElement.textContent += data
        }
      }
      /*
      // FOLLOWING IS ELEMENT BASED. ONLY USE FOR SOMETHING LIKE contenteditable HANDLING.
      const selection = window.getSelection();
      if (!selection.rangeCount) return false;
      // selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(data));
      */
    }
    /**
     * @see https://stackoverflow.com/a/55466400/1764521
    * @param {ClipboardEvent} event
    */
    const handleSyncing = (event) => {
      if (sync) {
        const data = window.getSelection().toString().replace(/[\n\r]+/g, '')
        event.clipboardData.setData('text/plain', data);
        this.setDataTransfer(event.clipboardData)
      }
    }
    /**
    * @param {ClipboardEvent} event
    */
    const handleShift = (event) => {
      if (shift) {
        const data = this.shift()
        applyToCurrentSelection(data)
        event.preventDefault()
      }
    }
    /**
    * @param {ClipboardEvent} event
    */
     const handlePop = (event) => {
      if (pop) {
        const data = this.pop()
        applyToCurrentSelection(data)
        event.preventDefault()
      }
    }
    const handleStopCopyOnEnd = () => {
      if (stopCopyOnEnd) {
        if (this.data.length === 0) {
          this.stopWatching()
        }
      }
    }
    const handleStopCutOnEnd = () => {
      if (stopCutOnEnd) {
        if (this.data.length === 0) {
          this.stopWatching()
        }
      }
    }
    const handleStopPasteOnEnd = () => {
      if (stopPasteOnEnd) {
        if (this.data.length === 0) {
          this.stopWatching()
        }
      }
    }

    /**
    * COPY LISTENER
    */
    const copyListener = (event) => {
      console.debug('copy', { event })
      handleSyncing(event)
      handleStopCopyOnEnd()
    }
    document.addEventListener('copy', copyListener)
    this.listeners['copy'] = copyListener

    /**
    * CUT LISTENER
    */
    const cutListener = (event) => {
      console.debug('cut', { event })
      handleSyncing(event)
      handleStopCutOnEnd()
    }
    document.addEventListener('cut', cutListener)
    this.listeners['cut'] = cutListener

    /**
    * PASTE LISTENER
    */
    const pasteListener = (event) => {
      console.debug('paste', { event })
      handleShift(event)
      handlePop(event)
      handleStopPasteOnEnd()
    }
    document.addEventListener('paste', pasteListener)
    this.listeners['paste'] = pasteListener

    return this
  }

  /**
  * CHAINABLE
  */
  stopWatching() {
    const { listeners } = this
    Object.entries(listeners).forEach(([key, handle]) => {
      document.removeEventListener(key, handle)
      delete listeners[key]
    })
    return this
  }

}
