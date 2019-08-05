import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyTabsModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyTabsModule
  ]
})
export class AppExtrasModule { }
