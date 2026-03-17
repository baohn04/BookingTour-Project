import * as crypto from 'crypto';
import * as https from 'https';

export const generateMomoPaymentUrl = async (code: string, totalAmount: number, origin: string): Promise<string> => {
  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const orderInfo = code;
  const partnerCode = 'MOMO';
  const redirectUrl = origin || 'http://localhost:3000';
  const ipnUrl = 'https://localhost:8080/api/v1/order/payment-result';
  const requestType = "payWithMethod";
  const amount = Math.round(totalAmount || 0).toString();
  const orderIdMomo = partnerCode + new Date().getTime();
  const requestId = orderIdMomo;
  const extraData = '';
  const orderGroupId = '';
  const autoCapture = true;
  const lang = 'vi';

  const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderIdMomo + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderIdMomo,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  });

  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  const payUrl = await new Promise<string>((resolve, reject) => {
    const reqMomo = https.request(options, resMomo => {
      let body = '';
      resMomo.setEncoding('utf8');
      resMomo.on('data', (chunk) => {
        body += chunk;
      });
      resMomo.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.payUrl) {
            resolve(result.payUrl);
          } else {
            reject(new Error("Momo Error: " + result.message));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    reqMomo.on('error', (e) => {
      reject(e);
    });

    reqMomo.write(requestBody);
    reqMomo.end();
  });

  return payUrl;
};

