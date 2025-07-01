
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
    <div className={`bg-white rounded-lg border-2 p-6 max-w-sm ${borderColor}`}>
      <div className="flex items-center mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
          borderColor.includes('blue') ? 'bg-blue-600' : 
          borderColor.includes('green') ? 'bg-green-600' : 'bg-yellow-600'
        }`}>
          {number}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default ProcessCard;
