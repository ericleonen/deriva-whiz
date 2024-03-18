import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <section className="w-screen flex-grow flex justify-center items-center flex-col">
        <h1 className="text-4xl font-bold">Deriva-Whiz</h1>
        <Link 
          href="/play"
          className="mt-3 text-2xl font-medium bg-green-400/30 text-green-500 py-2 px-8 rounded-md"
        >
          Play
        </Link>
      </section>
      <footer className="w-full py-3 flex justify-center">
        Built by <Link href="https://github.com/ericleonen" className="underline text-blue-500 ml-1">ericleonen</Link>
      </footer>
    </div>
  )
}