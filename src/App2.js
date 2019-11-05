// This replicates the getSnapshotBeforeUpdate API with hooks - solely for learning purposes. Don't do this at work :)
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import logo from './logo.png'
import './App.css'

const Chats = ({ chatList }) => (
  <>
    {chatList.map((chat, i) => {
      return (
        <li key={i} className='chat-bubble'>
          {chat}
        </li>
      )
    })}
  </>
)

const usePrevPropsAndState = (props, state) => {
  const prevPropsAndStateRef = useRef({ props: null, state: null })
  const prevProps = prevPropsAndStateRef.current.props
  const prevState = prevPropsAndStateRef.current.state

  useEffect(() => {
    prevPropsAndStateRef.current = { props, state }
  })

  return { prevProps, prevState }
}

const useGetSnapshotBeforeUpdate = (cb, props, state) => {
  // get prev props and state
  const { prevProps, prevState } = usePrevPropsAndState(props, state)
  const snapshot = useRef(null)

  // getSnapshotBeforeUpdate - not run on mount + run on every update
  const componentJustMounted = useRef(true)
  useLayoutEffect(() => {
    if (!componentJustMounted.current) {
      snapshot.current = cb(prevProps, prevState)
      console.log('snapshot.current', snapshot.current)
    }
    componentJustMounted.current = false
  })

  const useComponentDidUpdate = cb => {
    useEffect(() => {
      if (!componentJustMounted.current) {
        cb(prevProps, prevState, snapshot.current)
      }
    })
  }

  return useComponentDidUpdate
}

const INITIAL_STATE = {
  points: 10,
  chatList: ['Hey', 'Hello', 'Hi']
}
const App2 = props => {
  const chatThreadRef = useRef()

  const [state, setState] = useState(INITIAL_STATE)
  const { points, chatList } = state

  const useComponentDidUpdate = useGetSnapshotBeforeUpdate(
    (_, prevState) => {
      if (state.chatList > prevState.chatList) {
        return (
          chatThreadRef.current.scrollHeight - chatThreadRef.current.scrollTop
        )
      }
      return null
    },
    props,
    state
  )

  useComponentDidUpdate((prevProps, prevState, snapshot) => {
    console.log({ snapshot })
    if (snapshot !== null) {
      chatThreadRef.current.scrollTop =
        chatThreadRef.current.scrollHeight - snapshot
    }
  })

  const handleAddChat = () => {
    setState(prevState => ({
      chatList: [...prevState.chatList, 'Hello!!!']
    }))
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>You've scored {points} points.</p>
      </header>
      <section className='App-chat'>
        <p className='chat-header'>
          Football Chat{' '}
          <button className='chat-btn' onClick={handleAddChat}>
            Add Chat
          </button>
        </p>
        <ul className='chat-thread' ref={chatThreadRef}>
          <Chats chatList={chatList} />
        </ul>
      </section>
    </div>
  )
}

export default App2
