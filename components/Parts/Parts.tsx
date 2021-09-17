import { FC, useContext, useEffect, useState } from "react";
import SanityContext from "../../contexts/SanityContext";
import { PartAddition, PartsByType, Rule } from "../../types/hrv";
import { PartView } from "../PartView";
import { RuleBodyWrapper } from "../RuleBodyWrapper";
import { RuleHeader } from "../RuleHeader";
import { getPartAdditions, getPartsByTypes } from "./util";

interface PartsProps {
  rule: Rule;
  setRule: (aRule: Rule) => void;
  ruleSetIdentifier: string;
}

const capitolizeFirstLetter = (aString: string): string =>
  `${aString.charAt(0).toLocaleUpperCase()}${aString.slice(1)}`;

export const Parts: FC<PartsProps> = ({ rule, setRule, ruleSetIdentifier }) => {
  const { client, job } = useContext(SanityContext);
  const [partsByTypes, setPartsByTypes] = useState<PartsByType[] | null>(null);
  useEffect(() => {
    if (!job.report) return;
    getPartsByTypes({ client, job }).then((parts) => {
      setPartsByTypes(parts);
    });
  }, [job]);
  return (
    <div className="bg-background pb-4 min-h-screen">
      <RuleHeader
        rule={rule}
        setRule={setRule}
        ruleSetIdentifier={ruleSetIdentifier}
      />
      {partsByTypes && (
        <>
          {partsByTypes.map((partsByType) => (
            <div key={partsByType.type}>
              <RuleBodyWrapper>
                <p className="text-3xl font-semibold mb-6">
                  {capitolizeFirstLetter(partsByType.type)}
                </p>
                <ul>
                  {partsByType.parts.map((part) => (
                    <li className="my-4" key={part._key}>
                      <PartView partAddition={part} />
                    </li>
                  ))}
                </ul>
              </RuleBodyWrapper>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
