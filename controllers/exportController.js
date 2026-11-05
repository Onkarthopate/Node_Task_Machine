
import ErrorHandler from "../utils/ErrorHandler.js";
import * as exportController from "../services/exportService.js";

export const exportUsersByRole = ErrorHandler(async (req, res, next) => {
  const { role } = req.query;

  const csv = await exportController.exportUserService(role, res);

  res.attachment(`${role}_users.csv`);

  return res.type("text/csv; charset=utf-8").send(csv);

});

export const exportCandidateAppliedJob = ErrorHandler(async (req, res, next) => {
  const { id } = req.body;

  const csv = await exportController.candidateAppliedJobService(id);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="applied-jobs.csv"'
  );

  return res.status(200).send(csv);
});