import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Bus } from "../model/bus.entity";
import { BsbStorage, EasybsbCategory } from "../utils/bsb-store";

@ApiTags("bsb/bus/:id")
@Controller({
  path: "bsb/bus/:id"
})
export class CategoriesController {

  constructor(
    private readonly bsbStorage: BsbStorage
  ) {
    this.bsbStorage;
  }

  @Get('categories')
  public getCategories(
    @Param('id', ParseIntPipe) busId: Bus['id'],
    @Query() query: { lang: any } 
  ): Record<string, EasybsbCategory> {
    return this.bsbStorage.getConfiguration(busId, query.lang);
  }
}
