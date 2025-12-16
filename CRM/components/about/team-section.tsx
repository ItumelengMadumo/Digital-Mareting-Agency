import { Facebook, Twitter, Linkedin } from "lucide-react"

const people = [
  {
    name: "Sarah Johnson",
    role: "Co-Founder / CEO",
    imageUrl: "/placeholder.svg?height=150&width=150",
    bio: "Sarah has over 15 years of experience in digital marketing and previously led growth at a major social media platform.",
    socialLinks: [
      { name: "Twitter", url: "#", icon: Twitter },
      { name: "LinkedIn", url: "#", icon: Linkedin },
    ],
  },
  {
    name: "Michael Chen",
    role: "Co-Founder / CTO",
    imageUrl: "/placeholder.svg?height=150&width=150",
    bio: "Michael is a seasoned software engineer with a background in building scalable platforms for content management and delivery.",
    socialLinks: [
      { name: "Twitter", url: "#", icon: Twitter },
      { name: "LinkedIn", url: "#", icon: Linkedin },
    ],
  },
  {
    name: "Jessica Williams",
    role: "VP of Product",
    imageUrl: "/placeholder.svg?height=150&width=150",
    bio: "Jessica leads our product strategy, focusing on creating intuitive and powerful features that meet the needs of our diverse user base.",
    socialLinks: [
      { name: "Twitter", url: "#", icon: Twitter },
      { name: "LinkedIn", url: "#", icon: Linkedin },
    ],
  },
  {
    name: "David Rodriguez",
    role: "VP of Marketing",
    imageUrl: "/placeholder.svg?height=150&width=150",
    bio: "David brings a wealth of experience in content strategy and influencer marketing to help shape our brand and growth initiatives.",
    socialLinks: [
      { name: "Twitter", url: "#", icon: Twitter },
      { name: "LinkedIn", url: "#", icon: Linkedin },
      { name: "Facebook", url: "#", icon: Facebook },
    ],
  },
]

export default function TeamSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Team</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We're a diverse team of talented individuals passionate about social media and committed to helping our
            users succeed online.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {people.map((person) => (
            <li key={person.name}>
              <img
                className="aspect-square w-full rounded-2xl object-cover"
                src={person.imageUrl || "/placeholder.svg"}
                alt=""
              />
              <h3 className="mt-6 text-lg font-semibold leading-8">{person.name}</h3>
              <p className="text-base leading-7 text-blue-500">{person.role}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{person.bio}</p>
              <ul role="list" className="mt-6 flex gap-x-6">
                {person.socialLinks.map((social) => (
                  <li key={social.name}>
                    <a href={social.url} className="text-muted-foreground hover:text-primary">
                      <span className="sr-only">{social.name}</span>
                      <social.icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
