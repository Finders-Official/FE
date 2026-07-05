import { BigLogoIcon } from "@/assets/icon";
import React from "react";

type EmptyOrderStateProps = {
  description: string;
};

export const EmptyOrderState = ({ description }: EmptyOrderStateProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BigLogoIcon className="flex h-23.5 w-23.5 items-center justify-center rounded-full text-neutral-400" />
        <h2 className="text-center text-[1rem] leading-[155%] font-normal tracking-[-0.02rem] whitespace-pre-wrap text-neutral-300">
          {description.split(/\\n|\n/).map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h2>
      </div>
    </div>
  );
};
