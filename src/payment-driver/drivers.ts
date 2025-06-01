import { Driver as BaseDriver } from './driver';
import { Zarinpal } from './drivers/zarinpal';
import * as ZarinpalAPI from './drivers/zarinpal/api';

export { Zarinpal } from './drivers/zarinpal';

interface ConfigMap {
  zarinpal: ZarinpalAPI.Config;
}

export type ConfigObject = Partial<ConfigMap>;

export type DriverName = keyof ConfigMap;

const drivers = {
  zarinpal: Zarinpal,
};

export const getPaymentDriver = <Driver extends BaseDriver>(
  driverName: DriverName,
  config: Parameters<Driver['setConfig']>[0],
): Driver => {
  if (!drivers[driverName]) {
    throw Error(`This driver is not supported, supported drivers: ${Object.keys(drivers).join(', ')}`);
  }

  const driver = drivers[driverName];

  return new driver(config) as unknown as Driver;
};
