import { ConfigEnv } from "@/config/env";
import { Server, Socket } from "socket.io";
import http from "http";
import { PaymentRespositories } from "@/services/transaction/payment";
export interface CheckoutRequest {
  methodCode : string
  amount : number
  username : string
  transactionId : string
  whatsApp : string
}
export class WebSocketServer {
  private io: Server;
  private FRONTEND_URL: string | undefined = ConfigEnv().FRONTEND_URL;
  
  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: this.FRONTEND_URL || "*",
        methods: ['GET', 'POST']
      },
      allowEIO3: true,
      transports: ['websocket', 'polling']
    });
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);
      
      socket.emit("server:ack", { message: "Connected to server" });
      
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });

      socket.on("checkout:user",(req : CheckoutRequest)  => {
          const PaymentRepo = new PaymentRespositories()  
          PaymentRepo.Checkout(req)
          console.log(`Checkout request : ${req}`)
          
      })
      
      socket.on("client:ping", () => {
        socket.emit("server:pong", { timestamp: new Date().toISOString() });
      });
    });
  }
  
  public getIO(): Server {
    return this.io;
  }
}
