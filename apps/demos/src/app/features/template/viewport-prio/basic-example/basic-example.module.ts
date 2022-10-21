import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ROUTES } from './basic-example.routes';
import { BasicExampleComponent } from './basic-example.component';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { UnpatchModule } from '@rx-angular/template/unpatch';
import { DirtyChecksModule } from '../../../../shared/debug-helper/dirty-checks';
import { MatButtonModule } from '@angular/material/button';
import { VisualizerModule } from '../../../../shared/debug-helper/visualizer/visualizer.module';
import { ValueProvidersModule } from '../../../../shared/debug-helper/value-provider';
import { RenderingsModule } from '../../../../shared/debug-helper/renderings';
import { ViewportStrategyModule } from '../../../../../../../../libs/template/experimental/viewport-prio/src/lib/viewport-strategy.module';

const DECLARATIONS = [BasicExampleComponent];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [
    CommonModule,
    UnpatchModule,
    DirtyChecksModule,
    RouterModule.forChild(ROUTES),
    MatButtonModule,
    PushModule,
    LetModule,
    VisualizerModule,
    ValueProvidersModule,
    RenderingsModule,
    ViewportStrategyModule
  ],
  exports: [DECLARATIONS]
})
export class BasicExampleModule {
}
