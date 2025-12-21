'use client';

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

interface SkillLevelSelectorProps {
  selectedLevel: SkillLevel;
  onSelectLevel: (level: SkillLevel) => void;
}

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function SkillLevelSelector({
  selectedLevel,
  onSelectLevel,
}: SkillLevelSelectorProps) {
  return (
    <div className="flex gap-3">
      {SKILL_LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onSelectLevel(level.value)}
          className={`px-4 py-2 rounded-lg transition ${
            selectedLevel === level.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
