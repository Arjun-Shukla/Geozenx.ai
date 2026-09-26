import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// ==========================================
// GEMINI RESPONSE SCHEMA
// ==========================================

const responseSchema = {
  type: "object",

  properties: {

    transitionMatrix: {
      type: "array",

      items: {
        type: "object",

        properties: {

          category: {
            type: "string"
          },

          t1Percent: {
            type: "number"
          },

          t2Percent: {
            type: "number"
          },

          changePercent: {
            type: "number"
          },

          changeType: {
            type: "string",
            enum: [
              "increase",
              "decrease",
              "unchanged"
            ]
          },

          description: {
            type: "string"
          },

          filteredNoiseDelta: {
            type: "number"
          }

        },

        required: [
          "category",
          "t1Percent",
          "t2Percent",
          "changePercent",
          "changeType",
          "description",
          "filteredNoiseDelta"
        ]
      }
    },


    changeSummary: {

      type: "object",

      properties: {

        primaryVector: {
          type: "string"
        },

        totalAnalyzedAreaKm2: {
          type: ["number", "null"]
        },

        netClassShiftPercent: {
          type: "number"
        },

        confidenceScore: {
          type: "number"
        },

        filteredConfidenceScore: {
          type: "number"
        },

        spatialResolution: {
          type: "string"
        },

        timestamp: {
          type: "string"
        }

      },

      required: [
        "primaryVector",
        "totalAnalyzedAreaKm2",
        "netClassShiftPercent",
        "confidenceScore",
        "filteredConfidenceScore",
        "spatialResolution",
        "timestamp"
      ]
    }

  },

  required: [
    "transitionMatrix",
    "changeSummary"
  ]
};


// ==========================================
// ANALYZE TWO IMAGES
// ==========================================

app.post(
  "/api/analyze",
  upload.fields([
    {
      name: "beforeImage",
      maxCount: 1
    },
    {
      name: "afterImage",
      maxCount: 1
    }
  ]),

  async (req, res) => {

    try {

      const beforeImage =
        req.files?.beforeImage?.[0];

      const afterImage =
        req.files?.afterImage?.[0];


      // Check images

      if (!beforeImage || !afterImage) {

        return res.status(400).json({
          success: false,
          message: "Both BEFORE and AFTER images are required."
        });

      }


      // Convert images to Base64

      const beforeBase64 =
        beforeImage.buffer.toString("base64");

      const afterBase64 =
        afterImage.buffer.toString("base64");


      // Optional area supplied by frontend

      const areaKm2 =
        req.body.areaKm2
          ? Number(req.body.areaKm2)
          : null;


      // ==========================================
      // GEMINI PROMPT
      // ==========================================

      const prompt = `

You are an expert visual change detection AI.

You will receive TWO images.

IMAGE 1 = BEFORE
IMAGE 2 = AFTER

Compare them carefully.

This is a land-cover / remote-sensing style change detection application.

Analyze these categories when visible:

1. VEGETATION
2. BUILDINGS
3. WATER
4. BARE LAND
5. ROADS
6. OTHER IMPORTANT LAND-COVER TYPES

For each category estimate its visible percentage in:

t1Percent = BEFORE image
t2Percent = AFTER image

Calculate:

changePercent = t2Percent - t1Percent

Classify change as:

increase
decrease
unchanged

Write a short factual description of what changed.

IMPORTANT:

- Do NOT invent exact geographic measurements.
- Percentages are visual estimates of the visible image.
- If something cannot be reliably identified, use a reasonable estimate and lower confidence.
- Do not claim an exact km² area unless the user supplied one.
- Do not invent satellite sensor information.
- Confidence must represent confidence in the visual comparison.
- Focus on actual visible differences between the two images.

For filteredNoiseDelta:

Give a small estimated value representing possible noise/artifact difference.
Do NOT exaggerate it.

For primaryVector:

Describe the most significant transition.

Example:

"Vegetation → High-Density Buildings"

If the images do not show land-cover changes, clearly say so.

Return ONLY the requested JSON structure.
`;


      // ==========================================
      // GEMINI API
      // ==========================================

      const response =
        await ai.interactions.create({

          model: "gemini-3.8-flash",

          input: [

            {
              type: "image",

              data: beforeBase64,

              mime_type: beforeImage.mimetype
            },

            {
              type: "image",

              data: afterBase64,

              mime_type: afterImage.mimetype
            },

            {
              type: "text",

              text: prompt
            }

          ],


          // Structured JSON output

          response_format: {

            type: "text",

            mime_type: "application/json",

            schema: responseSchema

          }

        });


      // Parse Gemini JSON

      const result =
        JSON.parse(response.output_text);


      // If user supplied actual area,
      // attach it instead of inventing one.

      result.changeSummary.totalAnalyzedAreaKm2 =
        areaKm2;


      // Send to React

      res.json({

        success: true,

        data: result

      });


    } catch (error) {

      console.error(
        "Gemini Analysis Error:",
        error
      );

      res.status(500).json({

        success: false,

        message: "Image analysis failed.",

        error: error.message

      });

    }

  }
);
// ===============================
// AI CHATBOT
// ===============================

app.post("/api/chat", async (req, res) => {
  try {
    const { message, analysisContext, previousInteractionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required."
      });
    }

    const context = analysisContext
      ? `
You are Geozenx AI, an AI assistant for satellite and land-cover
change analysis.

Here is the latest image analysis result:

${JSON.stringify(analysisContext, null, 2)}

Use this analysis when answering the user's question.
Do not invent exact geographic measurements that are not present
in the provided analysis.
`
      : `
You are Geozenx AI, an AI assistant for satellite imagery,
land-cover classification, remote sensing and geographical
change analysis.

Answer clearly and helpfully.
`;

    const interactionInput = `${context}

USER QUESTION:
${message}
`;

    const interactionOptions = {
      model: "gemini-3.8-flash",
      input: interactionInput
    };

    // Continue previous conversation if available
    if (previousInteractionId) {
      interactionOptions.previous_interaction_id =
        previousInteractionId;
    }

    const response = await ai.interactions.create(interactionOptions);

    res.json({
      success: true,
      reply: response.output_text,
      interactionId: response.id
    });

  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Chatbot failed.",
      error: error.message
    });
  }
});


// ==========================================
// SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`
    Geozenx AI backend running on port ${PORT}
  `);

});