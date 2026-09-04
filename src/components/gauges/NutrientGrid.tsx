import { motion } from 'framer-motion';
import { VisualStatusGauge } from './VisualStatusGauge';
import type { NutrientStatus } from '../../types';

interface NutrientGridProps {
  nutrients: NutrientStatus[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function NutrientGrid({ nutrients }: NutrientGridProps) {
  if (!nutrients || nutrients.length === 0) return null;

  return (
    <motion.div
      className="grid grid-cols-1 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {nutrients.map((nutrient) => (
        <motion.div key={nutrient.key} variants={itemVariants} className="w-full">
          <VisualStatusGauge nutrient={nutrient} />
        </motion.div>
      ))}
    </motion.div>
  );
}
