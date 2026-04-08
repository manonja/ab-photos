export default function NotFound() {
  return (
    <>
      <title>404: This page could not be found.</title>
      <div className="flex h-screen flex-col items-center justify-center bg-white text-center font-sans text-black dark:bg-black dark:text-white">
        <div>
          <h1 className="m-0 inline-block border-r border-black/30 pr-[23px] mr-5 text-2xl font-medium leading-[49px] align-top dark:border-white/30">
            404
          </h1>
          <div className="inline-block">
            <h2 className="m-0 text-sm font-normal leading-[49px]">
              This page could not be found.
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}
