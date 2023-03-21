const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePOST(req, res);

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const handlePOST = async (req, res) => {
  const body = req.body;
  const parsedBody = JSON.parse(body);

  const type = parsedBody.type;
  const plot = parsedBody.plot;
  const mainCharacterName = parsedBody.mainCharacterName;
  const mainCharacterSkills = parsedBody.mainCharacterSkills;

  try {
    const storyResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `write a ${type} with the main character named ${mainCharacterName}, and is about ${plot}, who is skilled in ${mainCharacterSkills},`,
      temperature: 0.65,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const imageResponse = await openai.createImage({
      model: "image-alpha-001",
      prompt: `image of a ${type} where ${plot}`.replace("write", "illustrate"),
      n: 1,
      size: "512x512",
    });

    const story = storyResponse.data.choices[0].text;

    const image = imageResponse.data.data[0].url;

    res.status(200).json({ story, image, type });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Error generating story" });
  }
};

export default handler;
