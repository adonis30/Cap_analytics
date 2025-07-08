"use client";


const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-100 text-gray-900 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-2 text-lg">Learn more about our mission, vision, and values.</p>
        </div>
      </header>

      {/* Mission, Vision, Values */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To empower businesses and investors with cutting-edge tools and insights to drive growth
              and success.
            </p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To become the leading platform for business analytics and investment insights
              worldwide.
            </p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600">
              Integrity, innovation, and customer-centricity guide everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Meet the Core Project Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <img
                src="/assets/images/hero.png"
                alt="Team Member"
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-lg font-bold">Evans Chama</h3>
              <p className="text-gray-600">Project Manager</p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <img
                src="/assets/images/test-2.png"
                alt="Team Member"
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-lg font-bold">Onis Chirwa Ndhlovu</h3>
              <p className="text-gray-600">Programmer and Developer</p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <img
                src="/assets/images/test.png"
                alt="Team Member"
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-lg font-bold">Emmanuel Bwanga</h3>
              <p className="text-gray-600">Project Analyst</p>
            </div>
          </div>
        </div>
      </section>
       {/* Header */}
       <header className="bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-lg">We’d love to hear from you. Reach out to us today!</p>
        </div>
      </header>
       {/* Contact Form */}
       <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <form className="grid grid-cols-1 gap-6">
            <label className="flex flex-col">
              <span className="text-gray-700">Name</span>
              <input
                type="text"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Your name"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Your email"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-gray-700">Message</span>
              <textarea
                rows={5}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Your message"
              ></textarea>
            </label>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-bold">Address</h3>
            <p className="text-gray-600">140 2nd Street, Mwambula Road, Jesmondine</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-bold">Phone</h3>
            <p className="text-gray-600">+260 977 681 800,</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-bold">Email</h3>
            <p className="text-gray-600">info@capanalytics.site</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
