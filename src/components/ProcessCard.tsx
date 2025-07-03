
import { ReactNode } from "react";

interface ProcessCardProps {
  number: string;
  title: string;
  description: string;
  borderColor: string;
  icon?: ReactNode;
}

const ProcessCard = ({ number, title, description, borderColor, icon }: ProcessCardProps) => {
  return (
    <div className={`bg-white rounded-lg border-2 p-6 max-w-sm ${borderColor} hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 hover:scale-105 group cursor-pointer`}>
      <div className="flex items-center mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 transition-all duration-300 group-hover:scale-110 ${
          borderColor.includes('purple') ? 'bg-purple-600 group-hover:shadow-purple-500/50' : 
          borderColor.includes('green') ? 'bg-green-600 group-hover:shadow-green-500/50' : 
          'bg-yellow-600 group-hover:shadow-yellow-500/50'
        } shadow-lg group-hover:shadow-2xl`}>
          {number}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{description}</p>
      <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default ProcessCard;
