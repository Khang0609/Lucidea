import React from 'react';

interface PawCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
}

export const PawCheckbox: React.FC<PawCheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'border-[#C49A1B] bg-[#FFFBEA] scale-110 shadow-sm'
              : 'border-[#E2D9C2] bg-white group-hover:border-[#C49A1B]/60'
          }`}
        >
          <svg
            viewBox="0 0 469 412"
            className={`w-4 h-4 transition-all duration-300 ${
              checked
                ? 'fill-[#C49A1B] scale-100 rotate-0'
                : 'fill-[#C2B79E] scale-75 rotate-6 opacity-30 group-hover:opacity-60'
            }`}
          >
            <path d="M116.472 193.533C128.379 230.533 117.642 260.45 90.9718 269.033C64.3016 277.616 32.9717 260.533 21.4718 214.533C11.9718 168.533 23.9718 137.227 49.9718 133.033C80.9718 128.033 108.266 168.033 116.472 193.533Z" />
            <path d="M440.07 224.888C426.205 261.199 399.109 277.817 372.935 267.823C346.761 257.829 333.013 224.899 352.827 181.822C374.201 139.996 403.151 123.085 426.056 136.084C453.366 151.582 449.626 199.862 440.07 224.888Z" />
            <path d="M214.341 88.533C218.341 129.533 197.496 159.872 167.341 161.033C137.185 162.194 104.606 139.374 108.842 83.0329C113.841 16.5331 139.747 9.03313 159.341 9.03313C192.341 9.03313 211.658 61.0304 214.341 88.533Z" />
            <path d="M356.16 101.497C349.865 142.208 325.472 162.533 296.972 162.533C264.986 162.533 237.972 118.533 257.16 61.4413C272.222 16.6262 299.179 5.58133 318.16 10.4413C350.129 18.6267 360.382 74.1887 356.16 101.497Z" />
            <path d="M109.972 301.033C84.3717 333.433 95.6384 369.2 104.472 383.033C120.872 415.833 160.972 413.366 178.972 408.033C184.972 406.533 201.172 402.433 217.972 398.033C234.772 393.633 268.972 402.866 283.972 408.033C296.305 412.2 326.572 416.033 348.972 398.033C371.372 380.033 370.972 343.2 367.972 327.033C363.305 314.366 355.972 297.283 334.972 281.533C320.972 271.033 322.472 276.033 289.972 225.533C281.965 213.092 269.972 181.533 233.972 177.533C207.943 174.641 181.472 200.533 172.472 230.533C168.1 238.611 164.472 244.033 158.472 253.533C147.827 268.836 118.721 289.96 109.972 301.033Z" />
          </svg>
        </div>
      </div>
      <span className="text-sm text-[#8B7A5C] group-hover:text-[#6C5B3E] transition-colors duration-150 font-medium leading-tight select-none">
        {label}
      </span>
    </label>
  );
};
