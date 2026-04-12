'use client';

import { useState, useRef, useEffect } from 'react';
import { Target, X } from 'lucide-react';
import { RoleTarget } from '@/types/linkedin-profile';
import styles from '@/app/(dashboard)/linkedin/linkedin-optimizer.module.css';

interface RoleTargetingProps {
  targets: RoleTarget[];
  selected: RoleTarget | null;
  onSelect: (target: RoleTarget | null) => void;
}

export default function RoleTargeting({ targets, selected, onSelect }: RoleTargetingProps) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = targets.filter((t) =>
    t.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  if (selected !== null) {
    return (
      <div className={styles.roleSelected}>
        <Target size={16} />
        <span className={styles.roleSelectedTitle}>{selected.title}</span>
        <button
          className={styles.roleSelectedEdit}
          onClick={() => onSelect(null)}
        >
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className={styles.roleTargeting}>
      <div className={styles.roleInputWrap}>
        <Target size={16} className={styles.roleInputIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.roleInput}
          placeholder="What role are you targeting? (e.g. Senior Software Engineer...)"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
        />
        {showDropdown && filtered.length > 0 && (
          <div className={styles.roleDropdown}>
            {filtered.map((target) => (
              <div
                key={target.id}
                className={styles.roleDropdownItem}
                onMouseDown={() => {
                  onSelect(target);
                  setInputValue('');
                  setShowDropdown(false);
                }}
              >
                <span>{target.title}</span>
                {target.keywords.length > 0 && (
                  <span className={styles.roleDropdownKeywords}>
                    {target.keywords.slice(0, 2).join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
