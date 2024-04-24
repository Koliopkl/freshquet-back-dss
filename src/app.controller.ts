import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Get()
  getPofile() {
    return "hello world"
  }
}
