import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const IncomeVsInheritance = () => {
  const INCOME_YEARS = 14;

  const totalIncomePerYear = 1100; // €1,100 billion
  const inheritancePerYear = 400; // €400 billion
  const taxOnIncomePerYear = 231; // €231 billion
  const taxOnInheritancePerYear = 11; // €11 billion

  const totalIncome15Years = totalIncomePerYear * INCOME_YEARS;
  const totalTaxOnIncome15Years = taxOnIncomePerYear * INCOME_YEARS;
  const totalInheritance38Years = inheritancePerYear * 38;
  const totalTaxOnInheritance38Years = taxOnInheritancePerYear * 38;

  const incomeData = [
    { name: "Total Income", value: totalIncome15Years },
    { name: "Total Taxes on Income", value: totalTaxOnIncome15Years },
  ];

  const totalInheritanceData = [
    { name: "Total Inheritance", value: totalInheritance38Years },
    { name: "Total Taxes on Inheritance", value: totalTaxOnInheritance38Years },
  ];

  const CIRCLE_SIZE_FACTOR = 50;

  return (
    <div>
      <div className="w-full mt-8">
        <h3 className="text-lg font-semibold">Total Inheritance and Taxes Over 38 Years</h3>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 p-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={totalInheritanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value} B`}
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip formatter={(value) => `${value} B`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 p-2">
            <div className="flex justify-center items-center" style={{ height: '300px' }}>
              <div style={{ width: `${totalInheritance38Years / CIRCLE_SIZE_FACTOR}px`, height: `${totalInheritance38Years / CIRCLE_SIZE_FACTOR}px`, borderRadius: '50%', backgroundColor: '#0088FE', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginRight: '20px' }}>
                {totalInheritance38Years} B
              </div>
              <div style={{ width: `${totalTaxOnInheritance38Years / CIRCLE_SIZE_FACTOR}px`, height: `${totalTaxOnInheritance38Years / CIRCLE_SIZE_FACTOR}px`, borderRadius: '50%', backgroundColor: '#FF8042', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                {totalTaxOnInheritance38Years} B
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        <h3 className="text-lg font-semibold">Total Income and Taxes Over {INCOME_YEARS} Years</h3>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 p-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value} B`}
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip formatter={(value) => `${value} B`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 p-2">
            <div className="flex justify-center items-center" style={{ height: '300px' }}>
              <div style={{ width: `${totalIncome15Years / CIRCLE_SIZE_FACTOR}px`, height: `${totalIncome15Years / CIRCLE_SIZE_FACTOR}px`, borderRadius: '50%', backgroundColor: '#0088FE', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginRight: '20px' }}>
                {totalIncome15Years} B
              </div>
              <div style={{ width: `${totalTaxOnIncome15Years / CIRCLE_SIZE_FACTOR}px`, height: `${totalTaxOnIncome15Years / CIRCLE_SIZE_FACTOR}px`, borderRadius: '50%', backgroundColor: '#FF8042', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                {totalTaxOnIncome15Years} B
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsInheritance;