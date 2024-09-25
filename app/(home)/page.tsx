import ComparisonFeatures from "@/components/ComparisonFeatures";
import Announcement from "@/components/frontend/announcement";
import { Testimonials } from "@/components/frontend/testimonials";
import { AnimatedAvatars } from "@/components/global/avatar-circles";
import { CustomLinkButton } from "@/components/global/CustomLinkButton";
import Iframe from "react-iframe";
import StarRating from "@/components/global/StarRating";
import HowItWorks from "@/components/HowItWorks";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ModeToggle } from "@/components/mode-toggle";
import { Star } from "lucide-react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import SectionHeading from "@/components/global/SectionHeading";
import Pricing from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { useSession } from "next-auth/react";
import { CustomerReviews } from "@/components/frontend/CustomerReviews";
import Showcase from "@/components/frontend/showcase";
export default async function Home() {
  // const session = await getServerSession(authOptions);
  // const { data: session } = useSession();
  // console.log(session?.user);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl ">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Manage Projects and Clients Effertlessly
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 mb-4">
            Our comprehesive Projects Management System streamlines your
            workflow, empowering teams to collaborate effectively and deliver
            results on time. Start boosting your productivity today.
          </p>
          <CustomLinkButton title="Start a Free Trial" href="/login" />
          <div className="pt-8 pb-4 flex items-center  justify-center gap-8">
            <div className="">
              <AnimatedAvatars />
            </div>
            <div className="">
              <StarRating count={5} />
              <p className="dark:text-slate-900">
                50+ teams delivering projects faster
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl py-16">
        <div className="">
          <ComparisonFeatures />
        </div>
        <div className="py-16">
          <div className="relative rounded-lg overflow-hidden">
            <BorderBeam />
            <Image
              src="/dashboard.png"
              alt="This is the dashbaord Image"
              width={1775}
              height={1109}
              className="w-full h-full rounded-lg object-cover  border"
            />
          </div>
        </div>
        <div className="py-16">
          <CustomerReviews />
          {/* <Testimonials /> */}
        </div>
      </div>
    </main>
  );
}
