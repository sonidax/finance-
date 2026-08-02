import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Send, MessageSquare } from "lucide-react";

export default function HelpSupport() {
  const openPhone = () => (window.location.href = "tel:+911234567890");
  const openEmail = () => (window.location.href = "mailto:support@example.com");
  const openTelegram = () => window.open("https://t.me/yourchannel", "_blank");
  const openWhatsApp = () => window.open("https://wa.me/911234567890", "_blank");

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-2">Help / Support</h1>
        <p className="text-muted-foreground mb-6">Our support team is available — choose a contact option below.</p>

        <Card className="rounded-lg">
          <CardContent className="p-8">
            <p className="mb-6 text-sm text-muted-foreground">For any support regarding accounts, IPOs, or platform features, select a quick contact option below. These controls are built to be easily accessible on mobile devices.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={openPhone}
                aria-label="Call support"
                className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 text-white py-4 md:py-6 rounded-lg shadow-sm hover:shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Phone</span>
              </button>

              <button
                onClick={openEmail}
                aria-label="Email support"
                className="flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-500 text-black py-4 md:py-6 rounded-lg shadow-sm hover:shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email Support</span>
              </button>

              <button
                onClick={openTelegram}
                aria-label="Open telegram discussion"
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 md:py-6 rounded-lg shadow-sm hover:shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">Telegram</span>
              </button>

              <button
                onClick={openWhatsApp}
                aria-label="Open WhatsApp"
                className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-4 md:py-6 rounded-lg shadow-sm hover:shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">WhatsApp</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
