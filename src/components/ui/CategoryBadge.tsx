import React from 'react';
import { CATEGORY_COLORS } from '@/lib/mockData';

interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <span className={`badge-category ${colors.bg} ${colors.text}`}>
      {category}
    </span>
  );
}