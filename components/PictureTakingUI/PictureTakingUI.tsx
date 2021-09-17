import { SanityAssetDocument } from "@sanity/client";
import { ChangeEvent, FC, useRef, useContext, useEffect } from "react";
import SanityContext from "../../contexts/SanityContext";
import { InputRule, ReportItem, SavedMediaInput } from "../../types/hrv";
import {
  doesSavedRuleAlreadyExist,
  replaceSavedImageInReportWithNewImage,
  saveNewImageToReport,
} from "./util";

interface PictureTakingUIProps {
  rule: InputRule;
  setNextButtonDisabled: (isDisabled: boolean) => void;
}

export const PictureTakingUI: FC<PictureTakingUIProps> = ({
  rule,
  setNextButtonDisabled,
}) => {
  const { client, imageURL, setImageURL, job, setJob, mainView } = useContext(
    SanityContext
  );
  const takenImageRef = useRef(null);

  const handlePictureInput = (inputEvent: ChangeEvent<HTMLInputElement>) => {
    if (!inputEvent.target.files || !inputEvent.target.files[0]) return;
    client.assets
      .upload("image", inputEvent.target.files[0])
      .then((imageAsset: SanityAssetDocument) => {
        if (!doesSavedRuleAlreadyExist(job, rule)) {
          saveNewImageToReport({ client, job, setJob, rule, imageAsset });
        } else {
          replaceSavedImageInReportWithNewImage({
            client,
            job,
            setJob,
            rule,
            imageAsset,
          });
        }
        setNextButtonDisabled(false);
        setImageURL(imageAsset.url);
      });
  };

  const loadImageOnRenderEffect = () => {
    setImageURL("");
    const reportItemWithImage = job.report?.find(
      (reportItem: ReportItem) => reportItem.rule._ref === rule._id
    );
    if (!reportItemWithImage) return;
    const imageQuery = `*[_id == $ref][0]`;
    const imageParams = {
      ref: (reportItemWithImage.ruleResponse as SavedMediaInput).media[0].image
        .asset._ref,
    };
    client
      .fetch(imageQuery, imageParams)
      .then((imageAsset: SanityAssetDocument) => {
        setImageURL(imageAsset.url);
      });
  };
  useEffect(loadImageOnRenderEffect, [rule, job, mainView]);

  useEffect(() => {
    if (imageURL === "") {
      setNextButtonDisabled(true);
      return;
    }
    setNextButtonDisabled(false);
  }, [imageURL]);

  return (
    <div className="flex space-x-4">
      <div className="flex-grow">
        <div className="flex justify-center w-28 h-28 border border-purple-50 rounded">
          {imageURL === "" && (
            <img width="24" height="19" src="/camera.svg" alt="Camera Icon" />
          )}
          {imageURL !== "" && (
            <img ref={takenImageRef} src={imageURL} alt="From Camera" />
          )}
        </div>
      </div>
      <div className="flex space-y-4 flex-col flex-grow-2">
        <div className="text-lg font-semibold">
          Take a photo of what you did
        </div>
        <label htmlFor="pictureInput">
          <input
            id="pictureInput"
            type="file"
            accept="image/*"
            capture="environment"
            className="opacity-0 absolute left-0"
            onChange={handlePictureInput}
          />
          <div className="inline-block bg-purple-100 text-purple-600 px-2 py-4 font-bold rounded border border-purple-picture-button-border w-full text-center">
            {imageURL === "" ? "Take photo" : "Retake photo"}
          </div>
        </label>
      </div>
    </div>
  );
};
