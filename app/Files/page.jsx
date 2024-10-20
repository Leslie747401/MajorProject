import React from 'react'
import Navbar from '../../Components/Navbar'
import List from '../../Components/List'

export default function page() {
  return (
      <div className="flex flex-col items-center px-5 sm:px-16">

          <Navbar/>
          <List/>

      </div>
  )
}
