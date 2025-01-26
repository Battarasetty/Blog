import React, { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext';

const Dashboard = () => {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className={`h-screen overflow-auto flex items-center justify-center ${isDarkTheme ? "bg-[#10172A]" : 'bg-[#fff]'} `}>
      Dashboard
    </div>)
}

export default Dashboard