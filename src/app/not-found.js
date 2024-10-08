import Link from "next/link";

export const metadata = {
    title:"404 Page Not Found"
}

function NotFoundPage() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-2">Oops!</h1>
        <p className="text-gray-600 mb-4">
          It looks like you&apos;ve stumbled upon a page that doesn&apos;t exist.
        </p>
        <img src="/images/404.svg" alt="404 Error" className="w-full mb-4" />
        <p className="text-gray-600 mb-4">
          Try checking the URL or searching for what you&apos;re looking for.
          If you&apos;re still having trouble, feel free to contact us!
        </p>
        <Link
          className="bg-[#114061] hover:bg-[#11406192] text-white font-bold py-2 px-4 rounded"
          href={"/"}
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;