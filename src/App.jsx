{/*JSX components*/}
import NavBar from './components/NavBar'

{/*Hook to navigate in the pages*/}
import { Outlet } from 'react-router-dom'

{/*Css*/}
import './App.css'

function App() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App