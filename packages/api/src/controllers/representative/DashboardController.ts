import { Request, Response } from "express";

export class DashboardController {
  async index(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    console.log(id);

    return response.json({ message: "Hello world" });
  }
}
