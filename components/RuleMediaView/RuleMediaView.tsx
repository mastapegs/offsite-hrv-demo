import { SanityAssetDocument } from "@sanity/client";
import { FC, useContext, useEffect } from "react";
import SanityContext from "../../contexts/SanityContext";
import { ImageMedia, Rule } from "../../types/hrv";
import { RuleBodyWrapper } from "../RuleBodyWrapper";

interface RuleMediaViewProps {
  rule: Rule;
}

export const RuleMediaView: FC<RuleMediaViewProps> = ({ rule }) => {
  const { client, ruleMediaURL, setRuleMediaURL } = useContext(SanityContext);
  useEffect(() => {
    setRuleMediaURL(null);
    if (!rule.media || rule.media.length === 0) return;
    client
      .fetch(`*[_id == $ref][0]`, {
        ref: (rule.media[0] as ImageMedia).image.asset._ref,
      })
      .then((imageAsset: SanityAssetDocument) => {
        setRuleMediaURL(imageAsset.url);
      });
  }, [rule]);
  return (
    <>
      {ruleMediaURL && (
        <RuleBodyWrapper>
          <img
            className="rounded border border-gray-200"
            src={ruleMediaURL}
            alt="Rule Media"
          />
        </RuleBodyWrapper>
      )}
    </>
  );
};
