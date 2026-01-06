import type React from "react";

type InputFormSize = "medium" | "large";

interface InputFormProps {
  name?: string;
  placeholder: string;
  size: InputFormSize;
  className?: string;
  value?: string;
  invalidText?: string;
  timer?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
// onSubmit props 추가 필요
export const InputForm = ({
  name,
  placeholder,
  size,
  className,
  value,
  invalidText,
  timer,
  onChange,
}: InputFormProps) => {
  const sizeClass: Record<InputFormSize, string> = {
    medium: "h-[3.25rem] w-[15.75rem]",
    large: "h-[3.25rem] w-full",
  };
  return (
    <div>
      {name && <label htmlFor={name}>{name}</label>}
      <div className="relative mt-[1rem]">
        <input
          id={name}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className={`${sizeClass[size]} ${className} rounded-lg border border-neutral-800 p-2 placeholder:text-neutral-600 focus:outline-none`}
        />
        {timer && (
          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            {timer}
          </div>
        )}
      </div>
      {invalidText && (
        <p className="mb-[2.45rem] p-[0.625rem] text-sm">{invalidText}</p>
      )}
    </div>
  );
};
