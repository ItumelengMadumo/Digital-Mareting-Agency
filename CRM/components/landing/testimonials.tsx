const testimonials = [
  {
    body: "SocialSync completely transformed my workflow. I've cut my social media management time in half and seen a 30% increase in engagement.",
    author: {
      name: "Emma Rodriguez",
      handle: "emma_rodriguez",
      role: "Social Media Influencer",
      imageUrl: "/placeholder.svg?height=60&width=60",
    },
  },
  {
    body: "The ability to schedule posts across multiple platforms saved our marketing team countless hours. The analytics are top-notch too!",
    author: {
      name: "Mark Johnson",
      handle: "markj",
      role: "Marketing Director, TechCorp",
      imageUrl: "/placeholder.svg?height=60&width=60",
    },
  },
  {
    body: "As a solo entrepreneur, I need tools that make my life easier. SocialSync does exactly that - now I can focus on creating content, not managing it.",
    author: {
      name: "Sarah Chen",
      handle: "sarahchen",
      role: "E-commerce Business Owner",
      imageUrl: "/placeholder.svg?height=60&width=60",
    },
  },
  {
    body: "The calendar view is a game-changer for our content planning. We can visualize our entire social strategy and make adjustments on the fly.",
    author: {
      name: "David Miller",
      handle: "dave_m",
      role: "Content Manager, BrandBoost",
      imageUrl: "/placeholder.svg?height=60&width=60",
    },
  },
]

export default function Testimonials() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by creators and businesses worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-card p-8 text-sm leading-6 ring-1 ring-border shadow-sm">
                  <blockquote className="text-foreground">
                    <p>{`"${testimonial.body}"`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img
                      className="h-10 w-10 rounded-full bg-gray-50"
                      src={testimonial.author.imageUrl || "/placeholder.svg"}
                      alt=""
                    />
                    <div>
                      <div className="font-semibold">{testimonial.author.name}</div>
                      <div className="text-muted-foreground">{`@${testimonial.author.handle} · ${testimonial.author.role}`}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
