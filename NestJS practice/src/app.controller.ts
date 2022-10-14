import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('Routing1')
export class AppController {
  // The private syntax allows us to both declare and initialize the service member immediately in the same location.
  constructor(private readonly appService: AppService) {}

  // Get /Routing1
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Get /Routing1/Routing2
  @Get('/Routing2')
  // the method name is completely arbitrary (can be getDogs or any other names)
  getCats(): string {
    return 'Hi I am Routing 2~';
  }

  // Route wildcards: will match '/abcd' and '/abd'
  @Get('/abc?d')
  getWildCard1(): string {
    return 'Hi I am wild card route 1~';
  }

  // Route wildcards: will match '/abcde', '/abe'
  @Get('/ab(cd)?e')
  getWildCard2(): string {
    return 'Hi I am wild card route 2~';
  }

  // Route wildcards: will match '/efgh', '/efggh', '/efgggh' ......
  @Get('/efg+h')
  getWildCard3(): string {
    return 'Hi I am wild card route 3~';
  }

  // Route wildcards: will match '/efghi', '/efgfghi', '/efgfgfghi' ......
  @Get('/e(fg)+hi')
  getWildCard4(): string {
    return 'Hi I am wild card route 4~';
  }

  // Route wildcards: will match '/ijkl', '/ijk{can add anything here}l'
  @Get('/ijk*l')
  getWildCard5(): string {
    return 'Hi I am wild card route 5~';
  }
}
