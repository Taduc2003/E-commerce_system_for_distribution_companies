import React from 'react'
import Hero from '../../components/user/Hero'
import LatestCollection from '../../components/user/LatestCollection'
import BestSeller from '../../components/user/BestSeller'
import OurPolicy from '../../components/user/OurPolicy'

const Home = () => {
  return (
    <div>
      <Hero />
      {/* <LatestCollection /> */}
      <BestSeller />
      <OurPolicy />
    </div>
  )
}

export default Home
