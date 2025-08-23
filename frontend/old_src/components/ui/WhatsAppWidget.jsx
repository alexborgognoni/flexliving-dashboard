import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  return (
    <div className="fixed bottom-6 right-6">
      <button className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
