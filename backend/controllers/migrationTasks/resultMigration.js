import dayjs from "dayjs";
import { supabase } from "../../dbClient.js";
import { RESULTS_DB_NAME } from "../../constant.js";

const DAYS_DIVIDE = 7;

export const updateResultDate = async (req, res) => {
  const { data: results, error: selectionError } = await supabase
    .from(RESULTS_DB_NAME)
    .select(`id, created_at`);

  if (selectionError) {
    res.status(400).send({
      failure: true,
    });
    return;
  }

  if (results.length) {
    for (let index = 0; index < results.length; index++) {
      const { created_at, id } = results[index];
      const subtractDay = Math.floor(index / DAYS_DIVIDE);
      const updatedCreationDate = dayjs(created_at)
        .subtract(subtractDay, "day")
        .format();

      // Only uncomment this code once you are sure you want to update created date
      /*       const { data: updatedData, error: updateError } = await supabase
        .from(RESULTS_DB_NAME)
        .update({ created_at: updatedCreationDate })
        .eq("id", id); */
    }
  }
  res.status(200).send({
    success: true,
  });
};
