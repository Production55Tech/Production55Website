import { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <section className="bg-black text-white min-h-screen px-6 md:px-12 py-12">
      {/* contact us type beat */}
      <div className="basis-1/2">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-prod-pink text-6xl">Contact Us</div>
          <form className="flex flex-col gap-3 w-full px-[5vw]">
            <div className="flex flex-row gap-3">
              <input
                type="name"
                autoComplete="name"
                value={name}
                placeholder="john doe"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="text-white text-sm placeholder:text-gray-500 p-3 rounded-sm w-full border border-gray-600 focus:outline-1"
              />
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                placeholder="Email *"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="text-white text-sm placeholder:text-gray-500 p-3 rounded-sm w-full border border-gray-600 focus:outline-1"
              />
            </div>
            <div>
              <textarea
                type="text"
                required
                value={message}
                placeholder="Message"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                className="text-white text-sm placeholder:text-gray-500 p-3 rounded-sm w-full border border-gray-600 focus:outline-1 resize-y"
              />
            </div>
            <button type="button" className="bg-prod-pink rounded-sm p-2 w-full">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
