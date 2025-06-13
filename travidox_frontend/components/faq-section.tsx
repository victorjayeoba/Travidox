"use client"

import { Section } from "@/components/ui/section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const faqs = [
    {
      question: "How do I get started with investing on Travidox?",
      answer: "To get started, simply create an account, complete your profile, and verify your identity. Once approved, you can fund your account using any of our supported payment methods and start investing in your preferred assets."
    },
    {
      question: "What types of investments are available on Travidox?",
      answer: "Travidox offers a comprehensive range of investment options including stocks and forex trading with our AI-powered trading bot. You can also access professional financial education courses for certification, join our community for expert insights, and utilize our security center to protect your investments."
    },
    {
      question: "Is there a minimum deposit required?",
      answer: "No, Travidox doesn't require a minimum deposit to open an account. However, certain investment products may have their own minimum investment requirements."
    },
    {
      question: "How secure is my data and money with Travidox?",
      answer: "We implement bank-level security measures including 256-bit encryption, two-factor authentication, and regular security audits. Your investments are also protected by industry-standard insurance policies up to certain limits."
    },
    {
      question: "What fees does Travidox charge?",
      answer: "Travidox offers transparent pricing with no hidden fees. We charge small commissions on trades, with discounts available for high-volume traders. There are no account maintenance fees or inactivity charges."
    },
    {
      question: "How can I contact customer support?",
      answer: "Our customer support team is available 24/7 via live chat, email (hellotravidox@gmail.com), or phone (+234 808 903 2359). Premium account holders also get access to dedicated account managers for personalized assistance."
    }
  ]

export function FAQSection() {
  return (
    <Section id="faq" className="bg-white py-20 lg:py-28">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-green/10 p-4 rounded-full mb-4">
            <HelpCircle className="w-10 h-10 mx-auto text-brand-green" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-grey-text">
            Find answers to the most common questions about investing with Travidox.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-lemon-green-milk/50 rounded-lg mb-3 border px-4">
              <AccordionTrigger className="text-left font-semibold text-grey-heading hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-grey-text text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
} 