import { FC, useState } from "react";
import { Modal } from "../Modal";
import { RenderBlocks } from "../RenderBlocks";
import { InputRule, Rule } from "../../types/hrv";

interface RuleBodyProps {
  rule: Rule;
}

const handleAdditionalMediaFlyin = ({
  setIsDisplayed,
}: {
  setIsDisplayed: (boolean: boolean) => void;
}) => {
  setIsDisplayed(true);
};

export const RuleBody: FC<RuleBodyProps> = ({ rule }) => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  return (
    <>
      <div className="mb-3 text-gray-900 font-semibold text-2xl text-center">
        {rule.title}
      </div>
      <div className="mb-3 text-center text-gray-700 font-medium text-2xl">
        <RenderBlocks blocks={rule.description} />
      </div>
      {rule._type !== "terminatorRule" &&
        (rule as InputRule).inputType !== "input-picture" && (
          <>
            <div className="text-center mb-6 text-purple-600 font-semibold text-lg">
              {rule.additionalInformation?.additionalInfoMedia?.length && (
                <>
                  <span
                    onClick={() =>
                      handleAdditionalMediaFlyin({ setIsDisplayed })
                    }
                    className="cursor-pointer"
                  >
                    {rule.additionalInformation.additionalInfoLabel ||
                      "View More Details?"}
                  </span>
                  <Modal
                    rule={rule}
                    isDisplayed={isDisplayed}
                    setIsDisplayed={setIsDisplayed}
                  />
                </>
              )}
            </div>
            <div className="border-t-2 border-gray-200 w-full h-1 mx-auto" />
          </>
        )}
    </>
  );
};
