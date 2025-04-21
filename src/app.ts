import express, { Application, Router, json } from 'express';

import cors from 'cors';
import * as http from 'http';
import { MongoClient, Db } from 'mongodb';
import { config } from '../config/config';
import path from "path";
export class App {
  static express?: Application;
  static server: http.Server;
  static mongodb?: Db;
  private client?: MongoClient;
  static peerServer: any;
  dbname: string = config.database.dbname;
  port: number = config.port;
  constructor(options: { apis: { version: string; routers: Router[] }[] }) {
    if (App.express == undefined) {
      App.express = express();
      // App.express.use(cors({
      //   origin: 'https://mini-blog-fawn.vercel.app',
      //   credentials: true,
      //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      //   allowedHeaders: ['Content-Type', 'Authorization']
      // }))
      App.express.use(json());
      //   App.express.use((req, res, next) => {
      //     res.header("Access-Control-Allow-Origin", req.headers.origin); // dynamically allow any origin that matches
      //     res.header("Access-Control-Allow-Credentials", "true");
      //     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      //     if (req.method === "OPTIONS") {
      //         return res.sendStatus(204);
      //     }
      //     next();
      // });
      App.express.use((req, res, next) => {
        const allowedOrigins = [
            "https://mini-blog-fawn.vercel.app",
            "http://localhost:3000",
            "http://3.110.171.5:5000"
        ];
        const origin:any = req.headers.origin;
        if (allowedOrigins.includes(origin || '')) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        }
    
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
        if (req.method === "OPTIONS") {
            return res.sendStatus(204); // Properly respond to preflight
        }
    
        next();
    });
      // App.express.options('*', cors());
      App.express.use((req, res, next) => {
        console.log('\x1b[32m', `${req.method.toUpperCase()} ${req.path}`);
        next();
      });
      App.express.use('/public', express.static(path.join(__dirname, '../public')));
      for (const api of options.apis) {
        for (const router of api.routers) {
          App.express.use(`/api/${api.version}`, router);
        }
      }
    }
    if (App.mongodb == undefined) {
      this.client = new MongoClient('mongodb://127.0.0.1:27017/');
    }
  }
  async start() {
    App.server = new http.Server({}, App.express);
    if (this.client) {
      await this.client.connect();
      App.mongodb = this.client.db(this.dbname);
    }
    App.server?.listen(this.port, () => {
      console.log('server is online http://localhost:5000 successfully');
    });
  }
}