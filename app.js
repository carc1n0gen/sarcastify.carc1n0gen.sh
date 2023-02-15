import {
  html,
  render,
  useRef,
  useState,
  useMemo,
  useCallback 
} from 'https://unpkg.com/htm/preact/standalone.module.js';

function sarcasmify(text, startWith) {
  let newText = ''
  let flip = startWith === 'lower'
  for (const char of text) {
      if (flip) {
          newText += char.toLowerCase()
      } else {
          newText += char.toUpperCase()
      }

      if (/^[a-z]/i.test(char)) {
          flip = !flip
      }
  }

  return newText
}

function App() {
  const audio = useRef(null)
  const [input, setInput] = useState('Edit this text')
  const [startWith, setStartWith] = useState(localStorage.getItem('startWith') || 'lower')

  const output = useMemo(() => sarcasmify(input, startWith), [input, startWith])

  const onRedClick = useCallback(() => {
    audio.current && audio.current.play()
  }, [audio.current])

  const updateStartWith = useCallback(({target}) => {
    setStartWith(target.value)
    localStorage.setItem('startWith', target.value)
  })

  return html`
    <audio ref=${audio}>
      <source src="Never Gonna Give You Up Original.mp3" type="audio/mpeg" />
      Your browser does not support the audio tag
    </audio>
    <div class="buttons">
      <div class="buttons-button buttons-button-red" onClick=${onRedClick}></div>
      <div class="buttons-button buttons-button-yellow"></div>
      <div class="buttons-button buttons-button-green"></div>
    </div>
    <main>
      <h1>Sarcasm Case</h1>
      <input
        type="text"
        placeholder="Enter some text"
        aria-label="Enter some text to convert to sarcasm-case"
        value=${input}
        onKeyUp=${({target}) => setInput(target.value)}
      />
      <div class="radio-wrapper" onChange=${updateStartWith}>
        <label for="startWithLower" style="margin-left: auto;">
          Start with lower
          <input
            id="startWithLower"
            type="radio"
            name="startWith"
            value="lower"
            checked=${startWith === 'lower'}
          />
        </label>
        <label for="startWithUpper" style="margin-left: 2rem;">
          Start with upper
          <input
            id="startWithUpper"
            type="radio"
            name="startWith"
            value="upper"
            checked=${startWith === 'upper'}
          />
        </label>
      </div>
      <hr size="6" noshade color="black" />
      <div id="output">${output}</div>
      <div class="button-wrapper">
        <button
          type="button"
          aria-label="click to copy"
          onClick=${() => navigator.clipboard.writeText(output)}
        >
          Copy
        </button>
      </div>
    </main>
  `
}

render(html`<${App} />`, document.body)
