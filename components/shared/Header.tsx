import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b">
        <div className="wrapper flex items-center justify-between">
         <Link href="/" className="w-36">
         <Image 
         src="/assets/images/logo3.svg" width={128} height={28}
         alt="Capanalytics logo"
         />
         </Link>
         
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
         
         <div className="flex w-32 justify-end gap-3">
           
             
            <MobileNav />
           
         
           
         </div>
        </div>
    </header>
  )
}

export default Header
