import { GetStaticProps } from 'next'
import Header from './../../components/Header'
import { urlFor, sanityClient } from './../../sanity'
import { Post } from '../../typing'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
interface Props {
  post: Post
}
interface IformInput {
  _id: string
  name: string
  email: string
  comment: string
}
function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<IformInput> = async (data) => {
    console.log('data from slug', data)
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((data) => {
        console.log()
        setSubmitted(true)
      })
      .catch((err) => {
        setSubmitted(false)
        console.log(err)
      })
  }

  console.log(post)
  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
      />
      <article className="mx-auto max-w-3xl p-5   ">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
        <div className="flex items-center space-x-2 py-3 ">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div>
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NODE_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 py-10 px-5 text-white ">
          <h3 className="text-3xl font-bold">Thank you for the comment ! </h3>
          <p>Once it is approved , it will appear below</p>
        </div>
      ) : (
        <form
            // @ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5 "
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article ? </h3>
          <h4 className="text-3xl font-bold">Leave a comment below !</h4>
          <label className="mb-5 block">
            {/* register is used to do the connection to the react hook form which allows us to pull the data */}
            <input
              type="hidden"
              {...register('_id')}
              value={post._id}
              name="_id"
            />

            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline  ring-yellow-500 focus:ring"
              placeholder="Ex.Siddhesh Kukade"
              type="text"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline ring-yellow-500 focus:ring"
              placeholder="Ex. siddheshkukade2003@gmail.com"
              type="EMAIL"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline ring-yellow-500 focus:ring"
              placeholder="Ex.Siddhesh Kukade"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5 ">
            {errors.name && (
              <span className="text-red-500">The Name field is requried</span>
            )}
            {errors.email && (
              <span className="text-red-500">The Email field is requried</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                The Comment field is requried
              </span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      {/* Comments  */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}</span>:
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
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
// If you export a function called getStaticProps (Static Site Generation) from a page, Next.js will pre-render this page at build time using the props returned by getStaticProps.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // the params contains something like  this {slug: 'an-article-on-learning'}
  //the posts whose slug matches with the cureent  slug will be returned
  const query = `*[_type == "post" && slug.current == $slug ][0]{
    _id,
    _createdAt,
    title,
        author -> {
            name,
            image
        },
        'comments':*[
          _type == "comment" &&
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
    revalidate: 60, // after 60 second it will regernate the  page
  }
}
