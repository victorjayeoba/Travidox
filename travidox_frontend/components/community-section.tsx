import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommunitySectionProps {
  id?: string;
}

const features = [
  { icon: <MessageCircle className="w-6 h-6 text-brand-green" />, title: "Discussion Forums", description: "Share strategies and market insights" },
  { icon: <Users className="w-6 h-6 text-brand-green" />, title: "Expert Webinars", description: "Learn from investment professionals" },
  { icon: <TrendingUp className="w-6 h-6 text-brand-green" />, title: "Market Updates", description: "Stay informed with daily market news" },
]

const testimonials = [
  { name: "Mubarak D.", initial: "M", time: "2 hours ago", text: "Great insights on tech stocks today! Thanks to the community for the tips.", color: "bg-green-600" },
  { name: "Sarah M.", initial: "S", time: "5 hours ago", text: "The webinar on ETF strategies was incredibly helpful. Looking forward to more!", color: "bg-blue-600" },
]

export function CommunitySection({ id }: CommunitySectionProps) {
  return (
    <Section id={id} className="bg-lemon-green-milk py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading">Join the Conversation</h2>
            <p className="text-xl text-grey-text leading-relaxed">
              Connect with fellow investors, share insights, and learn from the community. Join thousands of investors
              building wealth together.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-grey-heading text-lg">{feature.title}</h3>
                  <p className="text-grey-text">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white">
              <a href="https://chat.whatsapp.com/I5PAMkie6r3KM8xBlPot4U">Join Community</a>
            </Button>
          </div>
        </div>

        <div className="relative group">
          <Card className="relative bg-white rounded-3xl p-8 shadow-lg transition-transform duration-500 group-hover:scale-105">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-grey-heading">Community Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="p-4 bg-gray-50/80 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Avatar>
                      <AvatarFallback className={testimonial.color + " text-white"}>{testimonial.initial}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-grey-heading">{testimonial.name}</p>
                      <p className="text-xs text-grey-text">{testimonial.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-grey-text italic">"{testimonial.text}"</p>
                </Card>
              ))}
              <p className="text-center text-sm text-grey-text pt-4">Join thousands of successful investors sharing insights daily.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  )
}
