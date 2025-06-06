"use client"

import { useState } from "react"
import { Section } from "@/components/ui/section"
import { PlusCircle, MinusCircle, HelpCircle } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "How do I get started with investing on Travidox?",
      answer: "To get started, simply create an account, complete your profile, and verify your identity. Once approved, you can fund your account using any of our supported payment methods and start investing in your preferred assets."
    },
    {
      question: "What types of investments are available on Travidox?",
      answer: "Travidox offers a wide range of investment options including stocks, bonds, ETFs, mutual funds, commodities, cryptocurrencies, and forex trading. We also provide fractional shares to make investing more accessible."
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
      answer: "Our customer support team is available 24/7 via live chat, email, or phone. Premium account holders also get access to dedicated account managers for personalized assistance."
    }
  ]

  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null)
    } else {
      setOpenIndex(index)
    }
  }

  return (
    <Section id="faq" className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Find answers to the most common questions about investing with Travidox
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                {openIndex === index ? (
                  <MinusCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                ) : (
                  <PlusCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
} 