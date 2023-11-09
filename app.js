import {
  html,
  render,
  useRef,
  useState,
  useMemo,
  useCallback 
} from 'https://unpkg.com/htm/preact/standalone.module.js';

const alphabet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-';

// pick <length> number of random characters from the alphabet
export function makeId(length) {
  const alphabetLength = alphabet.length;
  let id = '';
  for (let i = 0; i < length; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabetLength)];
  }
  return id;
}

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
  const [input, setInput] = useState('')
  const [startWith, setStartWith] = useState(localStorage.getItem('startWith') || 'lower')
  const [toasts, setToasts] = useState([])

  const output = useMemo(() => sarcasmify(input, startWith), [input, startWith])

  const onRedClick = useCallback(() => {
    audio.current && audio.current.play()
  }, [audio.current])

  const updateStartWith = useCallback(({target}) => {
    setStartWith(target.value)
    localStorage.setItem('startWith', target.value)
  })

  const copyToClipboard = useCallback(async () => {
    const id = makeId(16)
    await navigator.clipboard.writeText(output)
    setToasts((currentToasts) => [...currentToasts, {id, text: "ℹ️ Text copied to clipboard"}])
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id))
    }, 5000)
  }, [])

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
      <h1>Sarcastify!</h1>
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
          onClick=${copyToClipboard}
        >
          Copy
        </button>
      </div>
    </main>
    <div class="alert-box">
      ${toasts.map(toast => html`
        <div class="alert">${toast.text}</div>
      `)}
    </div>
  `
}

render(html`<${App} />`, document.body)
