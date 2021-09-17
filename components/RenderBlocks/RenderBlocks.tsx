import { FC, ReactElement, useEffect } from "react";
import BlockContent from "@sanity/block-content-to-react";
import { Block } from "../../types/hrv";

interface ListProps {
  type: "bullet" | "number";
  children: ReactElement;
}

interface BlockProps {
  children: ReactElement;
}

const serializers = {
  list: (props: ListProps) => {
    switch (props.type) {
      case "bullet":
        return (
          <ul className="text-left my-2 ml-8 list-disc">{props.children}</ul>
        );
      case "number":
        return (
          <ol className="text-left my-2 ml-8 list-decimal">{props.children}</ol>
        );
      default:
        return <></>;
    }
  },
  types: {
    block: (props: BlockProps) => {
      const { children } = props;
      return <p className="my-2">{children}</p>;
    },
  },
};

interface RenderBlocksProps {
  blocks: Block[];
}

export const RenderBlocks: FC<RenderBlocksProps> = ({ blocks }) => (
  <BlockContent blocks={blocks} serializers={serializers} />
);
