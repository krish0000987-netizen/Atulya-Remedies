import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/917697555159?text=Hello%20Atulya%20Remedies%2C%20I%20am%20interested%20in%20your%20pharma%20products."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-transform"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-7 h-7 text-[#fff]" />
  </a>
);

export default WhatsAppButton;
