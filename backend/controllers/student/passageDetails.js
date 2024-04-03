import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";

export const getPassages = async (req, res) => {
  const { subject, mode } = req.body || {};

  try {
    const { data, error } = await supabase
      .from("passages")
      .select(
        `
    id,
    passage_text
  `
      )
      .eq("subject", subject)
      .eq("typing_mode", mode);

    if (error) {
      throw new Error(error);
    }

    const parsedPassages = data?.map?.((passageDetails) => {
      return {
        passageId: passageDetails?.id,
        passageText: passageDetails?.passage_text,
      };
    });

    res.status(StatusCodes.OK).send({
      passages: parsedPassages || [],
      error: null,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ passages: [], error: "No passages available" });
  }
};
