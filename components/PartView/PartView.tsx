import { FC, useContext, useEffect, useState } from "react";
import SanityContext from "../../contexts/SanityContext";
import { Part, PartAddition } from "../../types/hrv";

interface PartViewProps {
  partAddition: PartAddition;
}

export const PartView: FC<PartViewProps> = ({ partAddition }) => {
  const { client } = useContext(SanityContext);
  const [part, setPart] = useState<Part | null>(null);
  useEffect(() => {
    client
      .fetch(`*[_id == $ref][0]`, { ref: partAddition.partToAdd._ref })
      .then((queriedPart: Part) => setPart(queriedPart));
  }, []);
  if (!part) return <></>;
  return (
    <div className="text-lg">
      <p>
        <span className="font-semibold">Part:</span> {part.description}
      </p>
      <p className="mt-1">
        <span className="font-semibold">Quantity:</span> {partAddition.quantity}
      </p>
    </div>
  );
};
