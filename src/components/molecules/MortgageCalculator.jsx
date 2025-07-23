import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const MortgageCalculator = ({ className = "" }) => {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMortgage = () => {
    if (loanAmount && interestRate && loanTerm) {
      const principal = parseFloat(loanAmount);
      const monthlyRate = parseFloat(interestRate) / 100 / 12;
      const numberOfPayments = parseFloat(loanTerm) * 12;

      if (monthlyRate === 0) {
        const monthly = principal / numberOfPayments;
        setMonthlyPayment(monthly);
        setTotalPayment(monthly * numberOfPayments);
      } else {
        const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        setMonthlyPayment(monthly);
        setTotalPayment(monthly * numberOfPayments);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl premium-shadow p-8 ${className}`}
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
          <ApperIcon name="Calculator" className="text-white" size={24} />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-secondary-800">
            Calculadora de Hipoteca
          </h3>
          <p className="text-secondary-600">Calcula tu pago mensual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Input
          label="Monto del Préstamo"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="2,000,000"
        />
        <Input
          label="Tasa de Interés (%)"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="8.5"
          step="0.1"
        />
        <Input
          label="Plazo (años)"
          type="number"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
          placeholder="20"
        />
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-secondary-600 text-sm mb-2">Pago Mensual</p>
            <p className="font-display text-3xl font-bold gradient-text">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-secondary-600 text-sm mb-2">Pago Total</p>
            <p className="font-display text-3xl font-bold text-secondary-800">
              {formatCurrency(totalPayment)}
            </p>
          </div>
        </div>
      </div>

      <Button variant="primary" className="w-full">
        <ApperIcon name="Send" size={16} className="mr-2" />
        Solicitar Pre-aprobación
      </Button>
    </motion.div>
  );
};

export default MortgageCalculator;