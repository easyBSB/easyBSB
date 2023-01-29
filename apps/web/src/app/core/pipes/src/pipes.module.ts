import { NgModule } from '@angular/core';
import { ToHexPipe } from './to-hex-value.pipe';

@NgModule({
  declarations: [
    ToHexPipe
  ],
  exports: [
    ToHexPipe
  ]
})
export class PipesModule {}
