import Link from "next/link";
import React from "react";

interface ActionCard {
  href: string;
  hoverColor: string;
  gradientFrom: string;
  gradientTo: string;
  // Expect a React element with an optional `className` prop so we can safely clone and inject sizing classes
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  pulseColor: string;
  progressColor: string;
  hoverProgressColor: string;
}

interface DashboardActionsProps {
  actionCards?: ActionCard[];
}

const DashboardActions = ({ actionCards = [] }: DashboardActionsProps) => {


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {actionCards.map((card, index) => (
        <Link
          key={index}
          href={card.href}
          className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:bg-gray-800/50 hover:border-gray-700 transition-all duration-200"
        >
          <div className="flex flex-col h-full">
            {/* Icon Section */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${getIconBgColor(card.hoverColor)}`}>
                <div className="text-white">
                  {React.isValidElement(card.icon)
                    ? React.cloneElement(card.icon, {
                      className: `${card.icon.props?.className ?? ''} w-6 h-6`.trim(),
                    })
                    : card.icon}
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors transform group-hover:translate-x-0.5 duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-200 text-base mb-2 group-hover:${getTextHoverColor(card.hoverColor)} transition-colors`}>
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Bottom Indicator */}
            <div className="mt-4 pt-3 border-t border-gray-800/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Quick action</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-gray-400">Available</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )

  // Helper functions for dynamic colors
  function getIconBgColor(hoverColor: string) {
    const colors: Record<string, string> = {
      'blue': 'bg-blue-500/20 group-hover:bg-blue-500/30',
      'green': 'bg-green-500/20 group-hover:bg-green-500/30',
      'yellow': 'bg-yellow-500/20 group-hover:bg-yellow-500/30',
      'purple': 'bg-purple-500/20 group-hover:bg-purple-500/30',
      'red': 'bg-red-500/20 group-hover:bg-red-500/30',
    }
    return colors[hoverColor] || 'bg-blue-500/20 group-hover:bg-blue-500/30'
  }

  function getTextHoverColor(hoverColor: string) {
    const colors: Record<string, string> = {
      'blue': 'text-blue-400',
      'green': 'text-green-400',
      'yellow': 'text-yellow-400',
      'purple': 'text-purple-400',
      'red': 'text-red-400',
    }
    return colors[hoverColor] || 'text-blue-400'
  }
};
export default DashboardActions;