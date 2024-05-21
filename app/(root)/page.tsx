import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
     <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
      <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
       <div className="flex flex-col justify-center gap-8">
        <h1 className="h1-bold">Looking To Invest And You Don't Know How To Go About It? </h1>
        <p className="p-regular-20 md:p-regular-24">
        We're a financial institution that pools together funds from various investors to invest in a diversified portfolio of assets such as stocks, bonds, real estate, and other securities. These firms typically provide professional management services and expertise to help investors achieve their financial goals.
        </p>
        <Button size="lg" asChild className="button w-full sm:w-fit">
          <Link href="/">
            Get more Info Now
          </Link>
        </Button>
       </div>
       <Image
        src="/assets/images/hero1.jpeg"
        alt="hero"
        width={1000}
        height={1000}
        className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
       />
      </div>
      </section> 
      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
      <h2 className="h2-bold"> Trusted by <br/> Many Investors and Companies</h2>
      </section>
    </>
  );
}
