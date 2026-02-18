import { shortenPostRequestBodySchema } from "../validations/request.validation.js";
import { nanoid } from "nanoid";
import {
  createURL,
  redirectUser,
  getCodes,
  deleteCode,
} from "../services/url.service.js";

const shorten = async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  const { url, code } = validationResult.data;

  //if user is providing shortcode that is fine its optional, if not we can generate from nanoid too.
  const shortcode = code ?? nanoid(6);
  const userID = req.user.id;
  const result = await createURL(url, shortcode, userID);
  return res.status(200).json({ result });
};

//this route is going to be the dynamic route and we place these routes at the end in stack, so they dont get matched with other routes
const shortCode = async (req, res) => {
  const code = req.params.shortCode;
  const result = await redirectUser(code);
  if (!result) {
    return res.status(404).json({ error: "Invalid URL" });
  }
  return res.redirect(result.targetURL);
};

const codes = async (req, res) => {
  const userId = req.user.id;
  const codes = await getCodes(userId);

  return res.json({ codes });
};

const deleteCodes = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const result = await deleteCode(id, userId);

  return res
    .status(200)
    .json({ deleted: true, deletedCodeURL: result.targetURL });
};
export { shorten, shortCode, codes ,deleteCodes};
