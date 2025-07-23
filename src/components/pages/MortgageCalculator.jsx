import React from "react";
import MortgageCalculatorComponent from "@/components/molecules/MortgageCalculator";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MortgageCalculator = () => {
  const tips = [
    {
      icon: "TrendingUp",
      title: "Mejora tu score crediticio",
      description: "Un mejor historial crediticio te ayudará a obtener mejores tasas de interés."
    },
    {
      icon: "PiggyBank",
      title: "Ahorra para el enganche",
      description: "Un enganche mayor reduce el monto del préstamo y los pagos mensuales."
    },
    {
      icon: "Calculator",
      title: "Considera todos los gastos",
      description: "Además del pago hipotecario, considera seguros, impuestos y mantenimiento."
    },
    {
      icon: "Target",
      title: "Define tu presupuesto",
      description: "Los pagos de vivienda no deberían exceder el 30% de tus ingresos mensuales."
    }
  ];

  const loanOptions = [
    {
      name: "Crédito Tradicional",
      rate: "8.5% - 12%",
      term: "15-30 años",
      downPayment: "20%",
      description: "Opción estándar con tasas competitivas y plazos flexibles."
    },
    {
      name: "Crédito INFONAVIT",
      rate: "4% - 10%",
      term: "30 años",
      downPayment: "10%",
      description: "Para trabajadores cotizantes con puntos INFONAVIT acumulados."
    },
    {
      name: "Crédito Cofinanciado",
      rate: "6% - 9%",
      term: "20-30 años",
      downPayment: "5%",
      description: "Combinación de crédito bancario e INFONAVIT para mayor capacidad de compra."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold gradient-text mb-4">
            Calculadora de Hipoteca
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Planifica tu inversión inmobiliaria con nuestra calculadora avanzada. 
            Descubre cuánto puedes permitirte y encuentra las mejores opciones de financiamiento.
          </p>
        </div>

        {/* Main Calculator */}
        <div className="mb-16">
          <MortgageCalculatorComponent />
        </div>

        {/* Loan Options */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-secondary-800 mb-4">
              Opciones de Financiamiento
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Conoce las diferentes alternativas de crédito hipotecario disponibles en México
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loanOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl card-shadow p-8 hover:premium-shadow transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-secondary-800 mb-2">
                    {option.name}
                  </h3>
                  <p className="text-secondary-600 mb-4">{option.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Tasa de interés:</span>
                    <span className="font-semibold text-primary-600">{option.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Plazo:</span>
                    <span className="font-semibold">{option.term}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Enganche mínimo:</span>
                    <span className="font-semibold">{option.downPayment}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Más información
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-secondary-800 mb-4">
              Consejos para tu Hipoteca
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Sigue estos consejos para obtener las mejores condiciones en tu crédito hipotecario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-xl card-shadow p-6 text-center hover:premium-shadow transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={tip.icon} className="text-white" size={24} />
                </div>
                <h3 className="font-display text-lg font-bold text-secondary-800 mb-3">
                  {tip.title}
                </h3>
                <p className="text-secondary-600 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-12 text-center text-white">
          <h2 className="font-display text-3xl font-bold mb-4">
            ¿Necesitas ayuda personalizada?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Nuestros asesores financieros especializados te ayudarán a encontrar 
            la mejor opción de financiamiento para tu situación específica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              size="lg"
              className="bg-white text-primary-600 border-white hover:bg-secondary-50"
            >
              <ApperIcon name="Phone" size={20} className="mr-2" />
              Contactar Asesor
            </Button>
            <Button 
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              <ApperIcon name="Calendar" size={20} className="mr-2" />
              Agendar Cita
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MortgageCalculator;