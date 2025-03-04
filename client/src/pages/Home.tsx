import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter text-gray-900 md:text-6xl lg:leading-[1.1]">
              Welcome to <span className="text-gray-900">SaaS</span>
            </h1>
            <p className="max-w-[750px] text-lg text-gray-600 sm:text-xl">
              Start building your next project with our modern stack
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Get Started
              </Link>
              <Link
                to="/documentation"
                className="inline-flex h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-gray-900">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Fast Performance</h3>
              <p className="text-gray-600">
                Built with React and Vite for lightning-fast development and production builds
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-gray-900">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Modern Stack</h3>
              <p className="text-gray-600">
                TypeScript, Tailwind CSS, and modern tooling for the best development experience
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-gray-900">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Customizable</h3>
              <p className="text-gray-600">
                Easily customize and extend the boilerplate to match your project needs
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;