import bcrypt from 'bcrypt';
import type { MediaType } from 'express';
import { createClient, type RedisClientType } from 'redis';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(
  getVar: () => TResult,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1]!;

  const memberParts = fullMemberName.split('.');

  return memberParts.at(-1);
}

export async function sendSms(phone: string, code: string): Promise<any> {
  const bodyData = {
    code: '3vd6ux7br2phf97',
    sender: '+983000505',
    recipient: phone,
    variable: {
      code,
    },
  };

  const result = await fetch(
    'https://api2.ippanel.com/api/v1/sms/pattern/normal/send',
    {
      method: 'POST',
      headers: {
        apikey:
          'OWVmYjViOGItNDU1Mi00MWJjLTlkZTYtODlhMTcwYWRlNjJiZDljNjBkNjI3M2ZhNTNiODI3ZTY2ZjY3NGJkZDQ3ZGI=',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    },
  );

  try {
    return await result.json();
  } catch (error) {
    console.error(error);
    return (error as any)?.message;
  }
}

export function getFileUrl(
  fileName: string,
  type: MediaType,
  bucketName: string,
  fileExtension: string,
) {
  if (bucketName && fileName && fileExtension && type) {
    return `https://${bucketName}.storage.c2.liara.space/1/${fileName}.${fileExtension}`;
  }

  return undefined;
}

export async function connectToRedis(
  options: {
    url: string;
  },
  retry: number = 5,
): Promise<RedisClientType | void> {
  const { url } = options;

  try {
    const client = createClient({
      url,
    });

    await client.connect();
    console.info('Redis is connected successfully.');
    return client as unknown as RedisClientType;
  } catch (error) {
    console.error('Redis connection error:', error);
    if (retry > 0) {
      console.warn(
        `Retrying to connect to Redis. Attempts remaining: ${retry}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 2500));
      return connectToRedis(options, retry - 1);
    } else {
      console.error('Redis is not reachable right now');
    }
  }
}

export function generateOtp(lengthNumber: number): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < lengthNumber; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

/**
 * Calculate final amount including Zarinpal fees.
 * Default: Normal gateway (1% up to 6,000 + 250) + Shaparak fee
 * @param amount مبلغ به ریال (IRR)
 * @returns amount + fee
 */
export function calculateZarinpalFinalAmount(amount: number): number {
  // کارمزد شاپرک
  const feeShaparak =
    amount <= 6_000_000 ? 1_200 : Math.min(amount * 0.0002, 40_000);

  // کارمزد زرین‌پال (درگاه معمولی)
  const feeZarinpal = Math.min(amount * 0.01, 6_000) + 250;

  // جمع کارمزد
  const totalFee = Math.round(feeShaparak + feeZarinpal);

  // مبلغ نهایی
  return Math.round(amount + totalFee);
}
