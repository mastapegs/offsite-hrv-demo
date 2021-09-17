import {
  FC,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SanityImageAssetDocument } from "@sanity/client";
import { RenderBlocks } from "../RenderBlocks";
import {
  ExternalImageMedia,
  ImageMedia,
  Rule,
  TextMedia,
} from "../../types/hrv";
import SanityContext from "../../contexts/SanityContext";

interface ModalProps {
  rule: Rule;
  isDisplayed: boolean;
  setIsDisplayed: (boolean: boolean) => void;
}

export const Modal: FC<ModalProps> = ({
  rule,
  isDisplayed,
  setIsDisplayed,
}) => {
  const modalBackgroundDiv = useRef<HTMLDivElement>(null);
  const handleModalClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === modalBackgroundDiv.current) setIsDisplayed(false);
  };
  return (
    <div
      ref={modalBackgroundDiv}
      onClick={handleModalClick}
      className={`fixed inset-0 z-50 overflow-auto bg-smoke ${
        isDisplayed ? "flex" : "hidden"
      }`}
    >
      <div className="overflow-y-auto fixed p-4 text-left text-black text-base font-normal bg-white rounded-tl-modal rounded-tr-modal w-full max-w-screen-sm h-5/6 bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="w-9 h-1 mt-2 mb-9 mx-auto rounded-3xl bg-gray-300" />
        <ul className="flex-col space-y-4">
          {rule.additionalInformation?.additionalInfoMedia
            ?.filter(
              (mediaType) =>
                mediaType._type === "textMedia" ||
                mediaType._type === "imageMedia" ||
                mediaType._type === "externalImageMedia"
            )
            .map((media) => {
              switch (media._type) {
                case "textMedia":
                  return (
                    <li>
                      <RenderBlocks blocks={(media as TextMedia).text} />
                    </li>
                  );
                case "imageMedia":
                  return (
                    <li>
                      <RenderImageMedia imageMedia={media} />
                    </li>
                  );
                case "externalImageMedia":
                  return (
                    <li>
                      <RenderExternalImageMedia externalImage={media} />
                    </li>
                  );
                default:
                  return <></>;
              }
            })}
        </ul>
        <button
          onClick={() => setIsDisplayed(false)}
          className="block w-5/6 mx-auto my-4 py-4 bg-gray-200 font-bold rounded outline-none"
          type="button"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

interface RenderImageMediaProps {
  imageMedia: ImageMedia;
}

const RenderImageMedia: FC<RenderImageMediaProps> = ({ imageMedia }) => {
  const [imageMediaURL, setImageMediaURL] = useState<string | null>(null);
  const [imageMediaAltText, setImageMediaAltText] = useState<string | null>(
    null
  );
  const { client } = useContext(SanityContext);
  useEffect(() => {
    client
      .fetch(`*[_id == $ref][0]`, { ref: imageMedia.image.asset._ref })
      .then((imageAsset: SanityImageAssetDocument) => {
        setImageMediaURL(imageAsset.url);
        setImageMediaAltText(imageMedia.altText || "Additional Information");
      });
  }, []);
  if (!imageMediaURL) return <p>Loading...</p>;
  return (
    <div>
      <img
        className="rounded border border-gray-400 shadow"
        alt={imageMediaAltText || "Additional Information"}
        src={imageMediaURL}
      />
    </div>
  );
};

interface RenderExternalImageMediaProps {
  externalImage: ExternalImageMedia;
}

const RenderExternalImageMedia: FC<RenderExternalImageMediaProps> = ({
  externalImage,
}) => (
  <div>
    <img
      className="rounded border border-gray-400 shadow"
      alt={externalImage.altText || "Additional Information"}
      src={externalImage.imageUrl}
    />
  </div>
);
