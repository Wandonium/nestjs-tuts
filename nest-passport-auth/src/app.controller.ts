import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('main-test')
  getMainTest() {
    return 'main testing 123...';
  }
}
