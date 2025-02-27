import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { totalWealth } from '@/data/wealth';

interface WealthDataItem {
  name: string;
  value: number;
}

export default function Inheritance() {
  const inheritedWealthPerYear = 400000000000;

  // Convert TOTAL_WEALTH from billions to full euros
  const totalWealthInherited = totalWealth * 0.7;
  const totalWealthSelfCreated = totalWealth * 0.3;

  const wealthData: WealthDataItem[] = [
    { name: 'Inherited Wealth', value: totalWealthInherited },
    { name: 'Self-Created Wealth', value: totalWealthSelfCreated },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  const growthRate = 0.04;
  const taxRate = 0.07;
  const years = 38;

  const yearlyData = Array.from({ length: years }, (_, i) => {
    const year = i + 2025;
    const wealth = Math.round(inheritedWealthPerYear * Math.pow(1 + growthRate, year));
    const taxedPart = Math.round(wealth * taxRate);
    return {
      year,
      wealth,
      taxedPart,
    };
  });

  return (
    <div className="">
      <div className="flex flex-wrap">
        <div className="p-2">
          <h3 className="text-lg font-semibold">Geschaffenes vs geerbtes Vermögen</h3>
          <p>Gesamt: {(totalWealth).toFixed(0)} Billion. Euro</p>
          <p>Geerbtes Vermögen: {(totalWealthInherited).toFixed(0)} Billion. Euro (70%)</p>
          <p>selbst erschaffenes Vermögen: {(totalWealthSelfCreated).toFixed(0)} Billion. Euro (30%)</p>
        </div>
        <div className="fflex justify-end">
          <div className="p-2 rounded shadow mt-4 w-full md:w-auto">
            <ResponsiveContainer width="100%" minWidth='300px' height={300}>
              <PieChart>
                <Pie
                  data={wealthData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {wealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        <h3 className="text-lg font-semibold">Über die nächsten 38 Jahren wird dieses Vermögen vererbt und geerbt. 400 Millarden Euro im Jahr.</h3>
        <div className="flex flex-wrap" style={{ height: '400px', overflowY: 'auto' }}>
          {yearlyData.map((data, index) => (
            <div key={index} className="p-1">
              <div className="bg-white p-1 rounded shadow">
                <h4 className="text-sm font-semibold">Jahr {data.year}</h4>
                <ResponsiveContainer width={80} height={80}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Vermögen', value: data.wealth },
                        { name: 'Steuern', value: data.taxedPart },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={30}
                      fill="#8884d8"
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

