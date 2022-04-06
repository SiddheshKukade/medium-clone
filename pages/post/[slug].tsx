import { GetStaticProps } from 'next'
import Header from './../../components/Header'
import { urlFor, sanityClient } from './../../sanity'
import { Post } from '../../typing'
interface Props {
  post: Post
}
function Post({ post }: Props) {
  console.log(post)
  return (
    <main>
      <Header />
    </main>
  )
}
export default Post

//getStaticPaths - to get the paths for the posts only and also provide a fallback
export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: { slug: { current: String } }) => ({
    params: { slug: post.slug.current },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
  //blocking will show empty page or a 404 page if the path is not found under the paths
}
// this will use the path from the getStaticPaths function and will get the data for each path and then will render it so it is Server Side Rendering
export const getStaticProps: GetStaticProps = async ({ params }) => {
  //the posts whose slug matches with the cureent  slug will be returned
  const query = `*[_type == "post" && slug.current == $slug][0]{
        title,
        _id,
        _createdAt,
        author -> {
            name,
            image
        },
        comment -> {
          _type == "comment"
          post._ref == ^._id && approved == true ],
        description,
        slug,
        mainImage,
        body
    }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    // follwing object will force to show 404 page if no posts are found on the paths
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
  }
}
