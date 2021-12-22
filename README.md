# Description

Class for handling multi copy and paste features.
This library contains no dependencies. Dependencies MAY be added later.

## Features

- Utility class for easily handling the clipboard with additional features.
- Copy multiple from text. See "Usage" for examples.
- Sync current clipboard data with utility class.
- Pop or shift from multiple clipboard data on each paste.

## Installation

```bash
npm install @theopenweb/multi-clipboard
```

## Usage

```js

import MultiClipboard from '@theopenweb/multi-clipboard'

const clipboard = new MultiClipboard()

// Sets data
clipboard.set('ANY DATA')
// CTRL + V => 'ANY DATA'
clipboard.get() // Gets data: returns 'ANY DATA'.
clipboard.clear() // Delete clipboard data.

// Sets from text using comma delimited format
clipboard.setText('a,b,c').startWatching({ shift: true })
// CTRL + V => a, CTRL + V => b, CTRL + V => c
clipboard.stopWatching() // stop watching events.

clipboard.setText('a,b,c') // Set items to clipboard.
const a = clipboard.shift() // Get first and remove.
const c = clipboard.pop() // Get last and remove.

```

## Examples

Examples can be checked by performing the below.

1. Execute below:

```bash
npx http-server ./
```

2. Open following changing 8080 with actual port number http://localhost:8080/example/index.html in browser.

## Roadmap

- Testing
- Linting
- Further options in examples
- Paste by number
