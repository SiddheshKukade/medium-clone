const Hero = () => {
  return (
    <div className="flex items-center justify-between border-y border-black bg-yellow-400 py-10 lg:py-4">
      <div className="space-y-5 px-10">
        <h1 className="max-w-xl font-serif text-6xl">
          <span className="underline decoration-black decoration-4">
            Medium
          </span>{' '}
          is place to write, read, and connect
        </h1>
        <h2>
          It's easy and free to post your thinking on any topic and connect with
          millions of readers
        </h2>
      </div>
      <img
        className="lg:h:full hidden h-32 md:inline-flex "
        src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
        alt="Medium M logo"
      />
    </div>
  )
}

export default Hero
