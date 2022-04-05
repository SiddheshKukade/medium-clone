import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from './../components/Header/index'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Medium.com - Blogs and Articles</title>
      </Head>
      <Header />
    </div>
  )
}

export default Home
