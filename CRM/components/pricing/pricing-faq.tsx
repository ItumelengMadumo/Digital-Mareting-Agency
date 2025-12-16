"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is SocialSync?",
    answer:
      "SocialSync is an all-in-one social media management platform that allows you to create, schedule, and publish content across multiple social media platforms. It helps individuals and businesses maintain a consistent online presence and save time on their social media management.",
  },
  {
    question: "How many social media accounts can I connect?",
    answer:
      "The number of social media accounts you can connect depends on your plan. Our Starter plan allows up to 3 accounts, Professional plan up to 10 accounts, and Business plan up to 25 accounts. If you need more, please contact us for custom enterprise solutions.",
  },
  {
    question: "Can I schedule posts in advance?",
    answer:
      "Yes! You can schedule posts in advance on all of our plans. Our content calendar allows you to plan and visualize your social media strategy days, weeks, or even months ahead of time.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a 14-day free trial for all our plans. No credit card required. You can try out all the features before deciding which plan is right for you.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "You can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.",
  },
  {
    question: "What platforms do you support?",
    answer:
      "We currently support Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok, Pinterest, and more. We're constantly adding support for new platforms based on user demand.",
  },
  {
    question: "Is there a limit to how many posts I can schedule?",
    answer:
      "The Starter plan limits you to 30 scheduled posts per month. The Professional and Business plans include unlimited scheduled posts.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from your account settings. Once canceled, you'll still have access to your plan until the end of your current billing cycle.",
  },
]

export default function PricingFaq() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-2 text-muted-foreground">Got questions? We've got answers.</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 text-center">
        <p className="text-muted-foreground">Still have questions? We're here to help.</p>
        <div className="mt-3">
          <a href="/contact" className="text-blue-500 hover:text-blue-600 font-medium">
            Contact our support team →
          </a>
        </div>
      </div>
    </div>
  )
}
