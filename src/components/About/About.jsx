import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Nav2 from "../Home/Util/Nav2";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./about.css";

const About = () => {
  const theme = useSelector((state) => state.pageState.theme);
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Nav2 />

      <section
        className={`w-full min-h-screen flex items-center justify-center transition-colors duration-300
          about-section
    ${!theme ? "bg-black text-white" : "bg-white text-black"}
  `}
      >
        <div
          className={`w-full max-w-3xl py-12 mt-24 relative bottom-48
    px-0 sm:px-4
    ${!theme ? "text-neutral-200" : "text-neutral-800"}
  `}
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Frequently Asked Questions
          </h2>

          <Accordion
            type="single"
            collapsible
            className={`w-full rounded-lg 
             
            `}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>What is NearGo?</AccordionTrigger>
              <AccordionContent>
                NearGo is a platform designed to connect people with great
                businesses, making discovery and engagement simple and
                meaningful.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                Is NearGo only for local businesses?
              </AccordionTrigger>
              <AccordionContent>
                No. NearGo goes beyond location by helping people connect with
                businesses they trust, both nearby and beyond.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Who can use NearGo?</AccordionTrigger>
              <AccordionContent>
                Anyone can use NearGo — users looking for quality services and
                businesses wanting to build meaningful connections with
                customers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                How does NearGo help businesses?
              </AccordionTrigger>
              <AccordionContent>
                NearGo helps businesses reach the right audience, build trust,
                and grow through better visibility and engagement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is NearGo free to use?</AccordionTrigger>
              <AccordionContent>
                NearGo offers free access with optional premium features to
                enhance visibility and growth.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default About;
