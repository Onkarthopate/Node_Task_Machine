
import { Parser } from "@json2csv/plainjs";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/UserAuth.js"

export const exportUsersByRole = ErrorHandler(async (req, res) => {
  const { role } = req.query;

  if (!["CANDIDATE", "RECRUITER"].includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const userData = await User.find({ role })
    .select("username email role createdAt")
    .lean();

  if (!userData.length) {
    const error = new Error("No users found");
    error.statusCode = 404;
    throw error;
  }

  const parser = new Parser({
    fields: ["username", "email", "role", "createdAt"],
    withBOM: true
  });

  const csv = parser.parse(userData);

  res.attachment(`${role}_users.csv`);
  return res.type("text/csv; charset=utf-8").send(csv);
});