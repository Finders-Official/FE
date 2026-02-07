// src/components/auth/InputForm.tsx
import type React from "react";

type InputFormSize = "medium" | "large";

interface InputFormProps {
  name?: string;
  placeholder: string;
  size: InputFormSize;
  borderClass?: string;
  textClass?: string;
  value?: string;
  invalidText?: string;
  timer?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const InputForm = ({
  name,
  placeholder,
  size,
  borderClass,
  textClass,
  value,
  invalidText,
  timer,
  onChange,
  disabled,
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
          autoComplete="off"
          id={name}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={[
            sizeClass[size],
            "rounded-lg border border-neutral-800 p-2 transition-colors duration-100 placeholder:text-neutral-600 focus:outline-none",
            borderClass ?? "",
            disabled
              ? "bg-neutral-850 cursor-not-allowed text-neutral-400 placeholder:text-neutral-500"
              : "",
          ].join(" ")}
        />

        {timer && (
          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            {timer}
          </div>
        )}
      </div>

      {invalidText && (
        <p className={`mb-[2.45rem] p-[0.625rem] text-sm ${textClass ?? ""}`}>
          {invalidText}
        </p>
      )}
    </div>
  );
};
