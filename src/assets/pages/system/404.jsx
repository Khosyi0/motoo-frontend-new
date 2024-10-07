import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <>
            <main className="flex flex-col items-center justify-center w-full h-screen gap-6 bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-9xl font-bold tracking-tighter text-gray-900 transition-all duration-500 ease-in-out transform hover:text-blue-500 hover:rotate-45 dark:text-gray-50">
                        404
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Oops! The page you are looking for does not exist.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                        <Link
                            className=" btn btn-primary transition-colors"
                            href="#"
                        >
                            Go Back Home
                        </Link>
                </div>
                <div className="absolute top-0 left-0 w-full h-full hidden">
                    <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gray-200 rounded-full animate-bounce dark:bg-gray-700" />
                    <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gray-200 rounded-full animate-bounce delay-75 dark:bg-gray-700" />
                    <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-gray-200 rounded-full animate-bounce delay-150 dark:bg-gray-700" />
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gray-200 rounded-full animate-bounce delay-200 dark:bg-gray-700" />
                </div>
            </main>
        </>
    )
}


