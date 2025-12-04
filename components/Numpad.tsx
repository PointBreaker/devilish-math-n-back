import React from 'react';

interface NumpadProps {
  onPress: (num: number) => void;
  disabled?: boolean;
}

interface ButtonProps {
  num: number;
  onPress: (num: number) => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ num, onPress, disabled }) => (
  <button
    disabled={disabled}
    onClick={() => onPress(num)}
    className={`
      flex-1 h-14 sm:h-20 text-2xl sm:text-3xl font-bold rounded-lg shadow-[0_4px_0_0_rgba(0,0,0,0.3)] 
      transition-all active:translate-y-1 active:shadow-none border-b-4 border-r-2 border-l-2 border-t-0
      ${disabled 
        ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none translate-y-1 border-gray-800' 
        : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-white active:bg-gray-300'}
    `}
  >
    {num}
  </button>
);

const Numpad: React.FC<NumpadProps> = ({ onPress, disabled }) => {
  // 1-5 on top row, 6-0 on bottom row
  const row1 = [1, 2, 3, 4, 5];
  const row2 = [6, 7, 8, 9, 0];

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto">
      <div className="flex gap-2 w-full">
        {row1.map((num) => <Button key={num} num={num} onPress={onPress} disabled={disabled} />)}
      </div>
      <div className="flex gap-2 w-full">
        {row2.map((num) => <Button key={num} num={num} onPress={onPress} disabled={disabled} />)}
      </div>
    </div>
  );
};

export default Numpad;