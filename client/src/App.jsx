import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Header from './Components/Header';
import { ToastContainer } from 'react-toastify';
import { PrivateRoute } from './Components/PrivateRoute';
import IsAdminPrivateRoute from './Components/IsAdminPrivateRoute';
import CreatePost from './pages/CreatePost';

const App = () => {
  return (
    <Router>
      <div className='flex flex-col min-h-screen w-[100vw]'>
        <div className='h-16'>
          <Header />
        </div>
        <div className='flex-grow overflow-auto'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/sign-in' element={<Signin />} />
            <Route path='/sign-up' element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            <Route element={<IsAdminPrivateRoute />}>
              <Route path='/create-post' element={<CreatePost />} />
            </Route>
            <Route path='/projects' element={<Projects />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </Router>
  )
}

export default App