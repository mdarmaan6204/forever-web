import React from 'react'
import Hero from '../components/Hero'
import LatestCollecion from '../components/LatestCollecion'
import BestSeller from '../components/BestSeller'
import OurPolicies from '../components/OurPlicy'
import NewsLetterBox from '../components/NewsLetterBox'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollecion/>
      <BestSeller/>
      <OurPolicies/>
      <NewsLetterBox/>
    </div>
  )
}

export default Home