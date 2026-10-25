import { CheckCircle } from "lucide-react"

const values = [
  {
    name: "Simplicity",
    description:
      "We believe that powerful tools should be easy to use. Our intuitive interface is designed for everyone from solo creators to enterprise teams.",
  },
  {
    name: "Innovation",
    description:
      "We continuously evolve our platform with cutting-edge features that anticipate the changing landscape of social media.",
  },
  {
    name: "Reliability",
    description:
      "Your social media presence demands consistency. Our platform is built on robust infrastructure to ensure your content is delivered as scheduled, every time.",
  },
  {
    name: "Customer-First",
    description:
      "Our users' success is our success. We actively listen to feedback and continuously improve our platform to meet their needs.",
  },
]

export default function MissionSection() {
  return (
    <div className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-500">Our mission</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Empowering digital creators</p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Our mission is to democratize social media management by providing accessible, powerful tools that help
                creators and businesses maintain a consistent and engaging online presence without the complexity.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground lg:max-w-none">
                {values.map((value) => (
                  <div key={value.name} className="relative pl-9">
                    <dt className="inline font-semibold">
                      <CheckCircle className="absolute left-1 top-1 h-5 w-5 text-blue-500" aria-hidden="true" />
                      {value.name}
                    </dt>{" "}
                    <dd className="inline">{value.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="grid grid-cols-1 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-500 mb-2">4</div>
                <div className="text-lg font-medium">Platforms from one post</div>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-500 mb-2">5 min</div>
                <div className="text-lg font-medium">From sign-up to first post</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
