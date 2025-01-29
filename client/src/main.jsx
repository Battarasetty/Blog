import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './Components/ThemeProvider.jsx'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
)
