import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Posts from '../components/Posts'
import Header from './../components/Header/'
import Hero from './../components/Hero/'
import react from 'react'
const Home: NextPage = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium.com - Blogs and Articles</title>
      </Head>
      <Header />
      <Hero />
      <Posts />
    </div>
  )
}

export default Home
