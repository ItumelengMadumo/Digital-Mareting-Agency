import Image from "next/image"
import SectionHeading from "@/components/site/section-heading"

export default function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading eyebrow="About SocialSync">
            Helping creators <em>post once</em> and <span>show up everywhere</span>
          </SectionHeading>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            SocialSync is built by Geekyysolutions in South Africa. We make publishing to Instagram, Facebook, TikTok and
            YouTube as simple as writing one post, so creators and small businesses can spend their time on the content
            instead of the copy-pasting.
          </p>
        </div>
        <Image
          src="/site/about-left-image.png"
          alt=""
          width={600}
          height={500}
          className="mx-auto h-auto w-full max-w-lg"
        />
      </div>
    </section>
  )
}
