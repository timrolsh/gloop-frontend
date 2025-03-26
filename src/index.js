import "./instrument"
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ReactQueryProvider from './providers/ReactQueryProvider'
import WalletContextProvider from './providers/WalletContextProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(

	<ReactQueryProvider>
		<WalletContextProvider>
			<App />
		</WalletContextProvider>
	</ReactQueryProvider>

)

reportWebVitals()
