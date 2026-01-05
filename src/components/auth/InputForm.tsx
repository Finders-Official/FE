type InputFormSize = "medium" | "large";

interface InputFormProps {
  name: string;
  placeholder: string;
  size: InputFormSize;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputForm = ({
  name,
  placeholder,
  size,
  className,
  value,
  onChange,
}: InputFormProps) => {
  const sizeClass: Record<InputFormSize, string> = {
    medium: "h-[3.25rem] w-[15.75rem]",
    large: "h-[3.25rem] w-full",
  };
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <form className="mt-[1rem]">
        <input
          id={name}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className={`${sizeClass[size]} ${className} rounded-lg border border-neutral-800 p-2 placeholder:text-neutral-600 focus:outline-none`}
        ></input>
      </form>
    </div>
  );
};
