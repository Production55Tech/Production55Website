import { useState } from "react";
import HighlightHoverText from "../../components/HighlightHoverText";
import HighlightHoverImage from "../../components/HighlightHoverImage";
import ClientsCarousel from "../../components/carousel/NotableClientsCarousel";
import WhiteLogoWithoutText from "../../assets/logos/prod55-white-notext.png";
import PinkLogoWithoutText from "../../assets/logos/prod55-pink-notext.png";
import BlackVisuals from "../../assets/visuals/visuals-black.png";
import PinkVisuals from "../../assets/visuals/visuals-pink.png";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [page, setPage] = useState(0);
  const pageCount = 2;
  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* first page */}
      <div className="h-dvh">
        <div className="relative h-full w-dvw overflow-hidden">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
              width: `${pageCount * 100}dvw`,
              transform: `translateX(-${page * 100}dvw)`,
            }}
          >
            <section className="h-dvh w-dvw shrink-0 bg-black">
              <div className="w-full h-screen flex flex-col px-[7vw] pt-[8vh] overflow-x-hidden">
                <div className="text-center flex flex-col w-[50%] gap-4 mt-[18vh]">
                  <HighlightHoverImage
                    className="w-[50%] mx-auto select-none"
                    baseSrc={WhiteLogoWithoutText}
                    glowSrc={PinkLogoWithoutText}
                  />
                  <HighlightHoverText
                    text="production 55"
                    className="text-[9vh] uppercase [text-box:trim-both_cap_alphabetic] select-none mx-auto block mt-[1vh]"
                  />

                  <div className="font-prodFont text-3xl text-center w-[85%] mx-auto mt-[4vh] mb-[2vh] select-none">
                    A full-service film & media production company crafting bespoke cinematic
                    experiences: from{" "}
                    <b>
                      <HighlightHoverText text="Vision" className="inline-block" />
                    </b>{" "}
                    to{" "}
                    <b>
                      <HighlightHoverText text="Screen" className="inline-block" />
                    </b>{" "}
                  </div>
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === pageCount - 1}
                    className="text-3xl bg-white rounded-lg w-fit p-3 mx-auto text-black transition-colors hover:bg-prod-pink hover:text-white duration-300 ease-in-out"
                  >
                    Learn More
                  </button>
                </div>
                <div className="w-[50%]"></div>
              </div>
            </section>
            <section className="h-dvh w-dvw shrink-0 bg-black">
              <div className="h-full w-full flex flex-row ">
                <div className="w-[50%] h-full">
                  <HighlightHoverImage
                    className="h-full w-full"
                    baseSrc={BlackVisuals}
                    glowSrc={PinkVisuals}
                  />
                </div>
                <div className="w-[50%] py-[10vh] px-[4vw] flex flex-col gap-6 text-white/85 select-none">
                  <div className="text-8xl text-center text-prod-pink">About Us</div>
                  <div className="text-4xl text-left mt-[3vh] text-white">In a Nutshell</div>
                  <div className="text-2xl text-justify font-prodFont">
                    Lorem ipsum dolor sit amet consectetur. Maecenas eu amet a platea vivamus neque
                    mattis. Consectetur at condimentum at tincidunt phasellus arcu ullamcorper.
                    Semper adipiscing felis enim proin diam duis amet amet ut. Ante in at amet
                    vehicula.
                  </div>
                  <div className="text-4xl text-left text-white">Our Approach</div>
                  <div className="text-2xl text-justify font-prodFont">
                    Lorem ipsum dolor sit amet consectetur. Maecenas eu amet a platea vivamus neque
                    mattis. Consectetur at condimentum at tincidunt phasellus arcu ullamcorper.
                    Semper adipiscing felis enim proin diam duis amet amet ut. Ante in at amet
                    vehicula.
                  </div>
                  <div className="text-4xl text-left text-white">Our Presence</div>
                  <div className="text-2xl text-justify font-prodFont">
                    Lorem ipsum dolor sit amet consectetur. Maecenas eu amet a platea vivamus neque
                    mattis. Consectetur at condimentum at tincidunt phasellus arcu ullamcorper.
                    Semper adipiscing felis enim proin diam duis amet amet ut. Ante in at amet
                    vehicula.
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* <button */}
          {/*   onClick={() => setPage(0)} */}
          {/*   disabled={page === 0} */}
          {/*   className="absolute left-6 top-1/2 -translate-y-1/2 z-10 disabled:opacity-30" */}
          {/* > */}
          {/*   ← */}
          {/* </button> */}
          {/* <button */}
          {/*   onClick={() => setPage(1)} */}
          {/*   disabled={page === pageCount - 1} */}
          {/*   className="absolute right-6 top-1/2 -translate-y-1/2 z-10 disabled:opacity-30" */}
          {/* > */}
          {/*   → */}
          {/* </button> */}
        </div>
      </div>

      {/* second page */}
      {/* <div className="h-dvh overflow-x-hidden"> */}
      {/*   <div className="w-full h-screen flex flex-col overflow-x-hidden"> */}
      {/*     <HighlightHoverImage */}
      {/*       className="w-[40%] h-[50%] object-scale-down" */}
      {/*       baseSrc={WhiteVisuals} */}
      {/*       glowSrc={PinkVisuals} */}
      {/*     /> */}
      {/*   </div> */}
      {/* </div> */}
    </main>
  );
}
