import React, { useRef, useReducer } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function reducer(state, action) {
  const { past, present, future } = state
  switch (action.type) {
    case 'ADD':
      return {
        past: [...past, present],
        present: [...present, { id: Math.random(), name: action.value }],
        future: [],
        canUndo: true,
        canRedo: false,
      }
    case 'UNDO':
      if (!state.canUndo) return state
      return {
        present: past[past.length - 1],
        past: past.slice(0, -1),
        future: [present, ...future],
        canUndo: past.length > 1,
        canRedo: true,
      }
    case 'REDO':
      if (!state.canRedo) return state

      const [newPresent, ...newFuture] = future
      return {
        past: [...past, present],
        present: newPresent,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      }
    default:
      return state
  }
}

const App = () => {
  const input = useRef()
  const [items, dispatch] = useReducer(reducer, {
    present: [],
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,
  })

  const addItem = (event) => {
    event.preventDefault()
    dispatch({ type: 'ADD', value: input.current.value })
    input.current.value = ''
  }

  return (
    <main>
      <h1>Shopping List</h1>
      <form className="add-product" onSubmit={addItem}>
        <label htmlFor="product" className="product">
          Product
        </label>
        <input ref={input} type="text" id="product" />
        <button type="submit">Add</button>
      </form>
      <div className="actions">
        <button disabled={!items.canUndo} onClick={() => dispatch({ type: 'UNDO' })}>
          Undo
        </button>
        <button disabled={!items.canRedo} onClick={() => dispatch({ type: 'REDO' })}>
          Redo
        </button>
      </div>
      <ul>
        {items.present.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </main>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
