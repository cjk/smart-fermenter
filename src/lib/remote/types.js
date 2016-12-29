export type Transport = {
  type: string,
  pin: number,
};

export type RemoteSwitch = {
  [name: string]: {
    desc: string,
    systemCode: ?string,
    unitCode: ?string,
    transport: ?Transport,
  },
};
