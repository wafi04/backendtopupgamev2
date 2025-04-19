export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (data: { idx: number; msg: string }) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: (msg: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
