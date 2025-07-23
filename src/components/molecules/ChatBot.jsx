import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "¡Hola! Soy tu asistente de Casa Vista. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");

  const predefinedResponses = {
    "hola": "¡Hola! ¿Estás buscando una propiedad específica? Puedo ayudarte con información sobre nuestras casas, departamentos y condominios.",
    "precio": "Nuestras propiedades tienen precios desde $800,000 MXN hasta $15,000,000 MXN. ¿Tienes un presupuesto específico en mente?",
    "ubicacion": "Tenemos propiedades en las mejores ubicaciones de México: CDMX, Guadalajara, Monterrey, Cancún, Puerto Vallarta y más. ¿Qué zona te interesa?",
    "hipoteca": "Puedes usar nuestra calculadora de hipoteca en la página principal. También podemos conectarte con asesores financieros especializados.",
    "contacto": "Puedes contactarnos al (55) 1234-5678 o por email a info@casavista.mx. También puedes agendar una cita desde cualquier propiedad."
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }
    
    return "Gracias por tu pregunta. Un asesor especializado se pondrá en contacto contigo pronto. Mientras tanto, ¿hay algo más en lo que pueda ayudarte?";
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      message: currentMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        message: getBotResponse(currentMessage),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <ApperIcon name={isOpen ? "X" : "MessageCircle"} size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <ApperIcon name="Bot" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Asistente Casa Vista</h4>
                    <p className="text-xs opacity-90">En línea</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.sender === "user"
                        ? "bg-primary-500 text-white"
                        : "bg-secondary-100 text-secondary-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  className="px-3"
                >
                  <ApperIcon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;