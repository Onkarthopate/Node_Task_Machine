
import * as exportService from "../services/exportService.js";

export const exportUsersByRole = async (req, res) => {
  const { role } = req.query;

  const csv = await exportService.exportUserService(role, res);

  res.attachment(`${role}_users.csv`);

  return res.type("text/csv; charset=utf-8").send(csv);
};

export const exportCandidateAppliedJob = async (req, res) => {
  const { id } = req.query;

  const csv = await exportService.candidateAppliedJobService(id);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="applied-jobs.csv"'
  );

  return res.status(200).send(csv);
};