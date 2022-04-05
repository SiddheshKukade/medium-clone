import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Posts from '../components/Posts'
import Header from './../components/Header/'
import Hero from './../components/Hero/'
import { sanityClient, urlFor } from '../sanity'
import { Post } from './../typing.d'

interface Props {
  posts: [Post]
}

const Home: NextPage = ({ posts }: Props) => {
  console.log(posts)
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
// Making the Home page as a server side rendered page
// so it's fast and doesn't load the whole app  everytime the user visits the home page
// and also it is SEO friendly
export const getServerSideProps = async () => {
  const query = `
*[_type=="post"]{
  title , 
  _id,
  
 author ->{
 image,
  name
},
description ,
slug,
mainImage,
}
`
  const posts = await sanityClient.fetch(query)
  // sending the props to the component to show it in the UI
  return {
    props: {
      posts,
    },
  }
}
  