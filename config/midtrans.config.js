import midtransClient from  'midtrans-client';
import * as dotenv from 'dotenv';

dotenv.config();

const CoreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default CoreApi;
