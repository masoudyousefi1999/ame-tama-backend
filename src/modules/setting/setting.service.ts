import { Injectable } from '@nestjs/common';
import { RedisService } from '../../shared/services/redis.service';

@Injectable()
export class SettingService {
  constructor(private redisService: RedisService) {
this.redisService.cacheData("gateway_basina_ocr", JSON.stringify({
  model_name: "tensorzero::model_name::gemini_2_0_flash",
  model_stream: true,
  model_temp: 0,
  system_prompt_ocr: `You are an OCR + information extraction assistant for lab reports.

Your output must follow these exact rules:

:white_check_mark: Output Rules:

Output only raw JSON, no markdown, no backticks, no explanations.

Root format must be exactly:

{"status":"ok","data":{...}}

If no data is found in the image, output:

{"status":"ok","data":{}}

Output must be strictly valid JSON (parsable by JSON.parse).

:white_check_mark: Data Schema (inside "data")

{
  "date_report": "YYYY-MM-DD",
  "patient_instructions": "",
  "tests": [
    {
      "title": "",
      "result": "",
      "unit": "",
      "range": "",
      "abnormal": true
    }
  ]
}

:white_check_mark: Extraction Rules:

OCR the lab image and correct text if necessary.

"date_report" → if a date appears in the image, use it in YYYY-MM-DD. If missing, use today's date.

"patient_instructions" → extract patient instructions. Must be Persian (فارسی). If none, use "".

"tests" → array of lab test results.

"title" → Test name in English only.

"result" → Numeric or text result. If missing, "".

"unit" → Measurement unit. If missing, "".

"range" → Reference range. If missing, "".

"abnormal" → true if flagged abnormal or outside range, otherwise false.

:x: Forbidden:

No markdown, no text description before or after JSON.

No code fences.

No keys other than the schema.`
}),undefined as any);
  }

  async getCachedData() {
    const allData = await this.redisService.getAllCachedData();
    return allData;
  }

  async deleteCachedData(key: string) {
    try {
      await this.redisService.deleteCachedData(key);

      return true;
    } catch (error) {
      return true;
    }
  }

  async deleteAllCachedData() {
    try {
      await this.redisService.deleteAllCachedData();

      return true;
    } catch (error) {
      return true;
    }
  }
}
