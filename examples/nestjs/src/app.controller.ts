import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";

import { AppService, type BatchRequestBody } from "./app.service";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  public getOverview() {
    return this.appService.getOverview();
  }

  @Post("batch")
  @HttpCode(200)
  public runBatch(@Body() body?: BatchRequestBody) {
    return this.appService.runBatch(body);
  }
}
