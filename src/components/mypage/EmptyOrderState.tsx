import { BigLogoIcon } from "@/assets/icon";

type EmptyOrderStateProps = {
  description: string;
};

export const EmptyOrderState = ({ description }: EmptyOrderStateProps) => {
  return (
    <div className="flex h-[calc(100vh-6.25rem)] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BigLogoIcon className="flex h-23.5 w-23.5 items-center justify-center rounded-full text-neutral-400" />
        <h2 className="text-center text-[1rem] leading-[155%] font-normal tracking-[-0.02rem] text-neutral-300">
          {description}
        </h2>
      </div>
    </div>
  );
};
