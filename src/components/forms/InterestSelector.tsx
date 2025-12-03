interface Interest {
    id: string;
    label: string;
}

interface InterestSelectorProps {
    label: string;
    interests: Interest[];
    selectedInterests: string[];
    onChange: (selected: string[]) => void;
}

export function InterestSelector({ label, interests, selectedInterests, onChange }: InterestSelectorProps) {
    const toggleInterest = (id: string) => {
        if (selectedInterests.includes(id)) {
            onChange(selectedInterests.filter((i) => i !== id));
        } else {
            onChange([...selectedInterests, id]);
        }
    };

    return (
        <div className="form-field">
            <span className="block text-xs font-medium text-foreground-muted mb-3">{label}</span>
            <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    return (
                        <button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            className={`
                                px-2 py-1 text-[10px] rounded-full
                                border transition-all duration-200
                                ${
                                    isSelected
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'text-foreground-secondary border-foreground/10 hover:border-primary/50 hover:text-foreground'
                                }
                            `}
                            style={!isSelected ? { backgroundColor: 'var(--input-field-bg)' } : undefined}
                        >
                            {interest.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
