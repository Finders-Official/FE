type InputFormSize = "medium" | "large";

interface InputFormProps {
  name: string;
  placeholder: string;
  size: InputFormSize;
  className?: string;
}

export const InputForm = ({
  name,
  placeholder,
  size,
  className,
}: InputFormProps) => {
  const sizeClass: Record<InputFormSize, string> = {
    medium: "h-[3.25rem] w-[15.75rem]",
    large: "h-[3.25rem] w-full",
  };
  return (
    <div>
      <p>{name}</p>
      <form className="mt-[1rem]">
        <input
          placeholder={placeholder}
          name={name}
          className={`${sizeClass[size]} ${className} bg-neutral-875 rounded-lg p-2 placeholder:text-neutral-600 focus:outline-none`}
        ></input>
      </form>
    </div>
  );
};
